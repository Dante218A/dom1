/// <reference lib="webworker" />
import { env, pipeline, TextStreamer, type TextGenerationPipeline } from '@huggingface/transformers'
import manifest from './model-manifest.json'
import type { ErrorCategory, RuntimeCheck, WorkerRequest, WorkerResponse } from './protocol'
import { normalizePath } from './progress'

const scope = self as unknown as DedicatedWorkerGlobalScope
const post = (message: WorkerResponse) => scope.postMessage(message)

const MAX_INPUT_TOKENS = 1500

const SYSTEM_PROMPT =
  'You summarize interior design briefs. Use only facts stated in the user text. ' +
  'Do not invent prices, costs, building codes, norms or safety claims. ' +
  'Reply in the same language as the text.'

function userPrompt(text: string) {
  return (
    'Summarize the following room brief as 3 to 5 short bullet points starting with "- ". ' +
    'Keep every number exactly as written. If something is not stated, do not add it.\n\n' +
    text
  )
}

// Same heuristic transformers.js 4.0.0 uses to choose between the asyncify and plain WASM builds.
function isSafari() {
  const ua = navigator.userAgent
  const vendor = (navigator as Navigator & { vendor?: string }).vendor ?? ''
  return vendor.includes('Apple') && !/CriOS|FxiOS|EdgiOS|OPiOS|mercury|brave/i.test(ua) && !ua.includes('Chrome') && !ua.includes('Android')
}

const variant = isSafari() ? 'safari' : 'asyncify'
const runtimeFiles = manifest.runtime.files.filter((file) => file.variant === variant)
const runtimeUrl = (role: 'mjs' | 'wasm') => {
  const file = runtimeFiles.find((entry) => entry.role === role)!
  return new URL(file.path, scope.location.origin).href
}

env.allowLocalModels = false
env.allowRemoteModels = true
env.remoteHost = manifest.remoteHost
env.remotePathTemplate = manifest.remotePathTemplate
const onnxEnv = env.backends.onnx as { wasm?: { wasmPaths?: unknown } }
onnxEnv.wasm = onnxEnv.wasm ?? {}
onnxEnv.wasm.wasmPaths = { mjs: runtimeUrl('mjs'), wasm: runtimeUrl('wasm') }

function remoteUrl(path: string) {
  return `${manifest.remoteHost}${manifest.modelId}/resolve/${encodeURIComponent(manifest.revision)}/${path}`
}

let generator: TextGenerationPipeline | null = null
let adapterLabel: string | null = null

async function checkRuntimeAssets(runId: number) {
  for (const file of runtimeFiles) {
    const url = new URL(file.path, scope.location.origin).href
    const check: RuntimeCheck = { path: file.path, role: file.role as 'mjs' | 'wasm', ok: false, contentType: null, detail: '' }
    try {
      const response = await fetch(url, { method: 'HEAD' })
      check.contentType = response.headers.get('content-type')
      const type = check.contentType ?? ''
      if (!response.ok) check.detail = `HTTP ${response.status}`
      else if (/text\/html/i.test(type)) check.detail = 'сервер повернув HTML замість runtime-файла'
      else if (file.role === 'wasm' && !/application\/wasm/i.test(type)) check.detail = `неправильний MIME: ${type || 'відсутній'}`
      else if (file.role === 'mjs' && !/javascript/i.test(type)) check.detail = `неправильний MIME: ${type || 'відсутній'}`
      else {
        check.ok = true
        check.detail = 'той самий origin, MIME правильний'
      }
    } catch (error) {
      check.detail = `мережа: ${(error as Error).message}`
    }
    post({ type: 'runtime-check', runId, check })
    if (!check.ok) {
      throw Object.assign(new Error(`${file.file}: ${check.detail}`), {
        category: (/MIME|HTML/.test(check.detail) ? 'mime' : 'network') as ErrorCategory,
        file: file.path,
      })
    }
  }
}

async function markCachedFiles(runId: number) {
  if (typeof caches === 'undefined') return
  try {
    const cache = await caches.open(manifest.cacheName)
    for (const file of manifest.files) {
      if (file.upstream !== 'present') continue
      const cached = await cache.match(remoteUrl(file.path))
      const length = cached?.headers.get('content-length')
      if (cached && (!length || Number(length) === file.size)) {
        post({ type: 'cache-hit', runId, file: file.path })
      }
    }
  } catch {
    // Cache API can be blocked (private mode, storage policy); files are then fetched from the network.
  }
}

// Turns an opaque runtime failure into a concrete per-file diagnosis with one tiny range request.
async function diagnose(path: string): Promise<{ category: ErrorCategory; message: string }> {
  const url = remoteUrl(path)
  try {
    const response = await fetch(url, { headers: { Range: 'bytes=0-0' } })
    const type = response.headers.get('content-type') ?? ''
    await response.body?.cancel()
    if (response.status === 404) {
      return { category: 'not-found', message: `Файла ${path} немає на revision ${manifest.revision.slice(0, 10)}.` }
    }
    if (!response.ok) return { category: 'network', message: `${path}: Hugging Face відповів HTTP ${response.status}.` }
    if (/text\/html/i.test(type)) return { category: 'mime', message: `${path}: замість файла моделі повернено HTML.` }
    return { category: 'network', message: `${path}: передача перервалася. Перевірте з’єднання та спробуйте ще раз.` }
  } catch {
    if (!navigator.onLine) return { category: 'network', message: `${path}: немає з’єднання з мережею.` }
    return {
      category: 'cors',
      message: `${path}: браузер заблокував читання відповіді (CORS або мережевий фільтр). Сервер Hugging Face має дозволяти цей origin.`,
    }
  }
}

function classify(error: unknown): ErrorCategory {
  const text = String((error as Error)?.message ?? error)
  if (/out of memory|OOM|allocat|memory/i.test(text)) return 'memory'
  if (/shader|pipeline creation|WGSL|GPUValidation|device lost/i.test(text)) return 'shader'
  if (/webgpu|adapter/i.test(text)) return 'webgpu'
  return 'model'
}

async function load(runId: number) {
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<{ info?: { vendor?: string; architecture?: string } } | null> } }).gpu
  if (!gpu) throw Object.assign(new Error('WebGPU недоступний у Web Worker цього браузера.'), { category: 'webgpu' })
  const adapter = await gpu.requestAdapter()
  if (!adapter) throw Object.assign(new Error('Браузер не надав GPU-адаптер для WebGPU.'), { category: 'webgpu' })
  adapterLabel = [adapter.info?.vendor, adapter.info?.architecture].filter(Boolean).join(' · ') || null

  await checkRuntimeAssets(runId)
  await markCachedFiles(runId)
  post({ type: 'phase', runId, phase: 'downloading' })

  const inFlight = new Set<string>()
  generator = (await pipeline(manifest.task as 'text-generation', manifest.modelId, {
    revision: manifest.revision,
    dtype: manifest.dtype as 'q4',
    device: manifest.device as 'webgpu',
    progress_callback: (info) => {
      if (info.status === 'ready' || info.status === 'progress_total') return
      const file = normalizePath(info.file)
      if (info.status === 'initiate') inFlight.add(file)
      if (info.status === 'done') inFlight.delete(file)
      if (info.status === 'done' && inFlight.size === 0) post({ type: 'phase', runId, phase: 'warming' })
      if (info.status === 'progress') {
        post({ type: 'file', runId, status: 'progress', file, loaded: info.loaded, total: info.total })
      } else {
        post({ type: 'file', runId, status: info.status, file })
      }
    },
  }).catch(async (error) => {
    const pending = [...inFlight]
    if (pending.length > 0) {
      const diagnosis = await diagnose(pending[0])
      for (const file of pending) post({ type: 'file-error', runId, file, reason: diagnosis.message })
      throw Object.assign(new Error(diagnosis.message), { category: diagnosis.category, file: pending[0] })
    }
    throw error
  })) as TextGenerationPipeline

  post({ type: 'phase', runId, phase: 'warming' })
  const started = performance.now()
  const warm = await generator([{ role: 'user', content: 'Summarize: The room is 12 m2 and faces north.' }], {
    max_new_tokens: 8,
    do_sample: false,
  })
  const warmText = lastMessage(warm)
  if (!warmText.trim()) throw Object.assign(new Error('Прогрів не дав тексту: модель не відповіла.'), { category: 'model' })
  post({ type: 'ready', runId, adapter: adapterLabel, warmupMs: Math.round(performance.now() - started) })
}

function lastMessage(output: unknown): string {
  const first = (Array.isArray(output) ? output[0] : output) as { generated_text?: unknown }
  const generated = first?.generated_text
  if (Array.isArray(generated)) return String((generated.at(-1) as { content?: string })?.content ?? '')
  return typeof generated === 'string' ? generated : ''
}

async function summarize(runId: number, text: string) {
  if (!generator) throw Object.assign(new Error('Модель ще не готова.'), { category: 'model' })
  const inputTokens = generator.tokenizer.encode(text).length
  if (inputTokens > MAX_INPUT_TOKENS) {
    throw Object.assign(
      new Error(`Текст містить ${inputTokens} токенів, а обмеження — ${MAX_INPUT_TOKENS}. Скоротіть документ.`),
      { category: 'input' },
    )
  }
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt(text) },
  ]
  let outputTokens = 0
  const streamer = new TextStreamer(generator.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (chunk: string) => post({ type: 'token', runId, text: chunk }),
    token_callback_function: () => {
      outputTokens += 1
    },
  })
  const started = performance.now()
  const output = await generator(messages, {
    max_new_tokens: manifest.maxNewTokens,
    do_sample: false,
    streamer,
  })
  post({
    type: 'summary',
    runId,
    text: lastMessage(output).trim(),
    inputTokens,
    outputTokens,
    ms: Math.round(performance.now() - started),
  })
}

scope.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data
  const stage = request.type === 'load' ? 'load' : 'summarize'
  try {
    if (request.type === 'load') await load(request.runId)
    else await summarize(request.runId, request.text)
  } catch (error) {
    const err = error as Error & { category?: ErrorCategory; file?: string }
    post({
      type: 'error',
      runId: request.runId,
      stage,
      category: err.category ?? classify(err),
      message: err.message ?? String(error),
      file: err.file,
    })
  }
})

post({ type: 'worker-ready', runId: 0 })
