#!/usr/bin/env node
// Prepares same-origin runtime assets (ONNX Runtime Web JS + WASM) and the pinned model manifest
// for the in-browser LFM2.5 summarizer. Runs automatically before `next build` and `next dev`.
// Any mismatch (version, missing file, size, HTTP status, CORS, MIME) stops the build with a precise message.
//
// Flags:
//   --soft   Dev mode: on network failure keep the previously committed manifest and only warn.

import { createRequire } from 'node:module'
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SOFT = process.argv.includes('--soft')
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

const PIN = {
  task: 'text-generation',
  modelId: 'onnx-community/LFM2.5-350M-ONNX',
  revision: '7dd4999565b0342c381ba90a3d8fc467d6df19c4',
  dtype: 'q4',
  device: 'webgpu',
  transformersVersion: '4.0.0',
  referenceSpace: {
    id: 'webml-community/lfm2.5-webgpu-summarizer',
    revision: '6c8e9d78365c70775e09df95b7c6c72a4d9638ff',
    url: 'https://huggingface.co/spaces/webml-community/lfm2.5-webgpu-summarizer',
  },
}

// Sizes verified manually for this exact revision + dtype. Re-verify if revision or dtype changes.
const VERIFIED_SIZES = {
  'onnx/model_q4.onnx': 183442,
  'onnx/model_q4.onnx_data': 293629952,
}

// Files documented as optional by the runtime (pipeline `optional_configs`).
const OPTIONAL_FILES = new Set(['generation_config.json'])

const HF = 'https://huggingface.co'
const REMOTE_HOST = 'https://huggingface.co/'
const REMOTE_PATH_TEMPLATE = '{model}/resolve/{revision}/'
const PROBE_ORIGIN = 'https://example-deployment.vercel.app'

const MANIFEST_PATH = path.join(ROOT, 'lib/ml/model-manifest.json')

class PrepareError extends Error {}
const fail = (message) => {
  throw new PrepareError(message)
}
const log = (message) => console.log(`[prepare-model-assets] ${message}`)

function kindOf(file) {
  if (file.endsWith('.onnx')) return 'graph'
  if (/\.onnx_data(_\d+)?$/.test(file)) return 'weights'
  if (file.startsWith('tokenizer')) return 'tokenizer'
  return 'config'
}

function parseContentRangeTotal(value) {
  const match = /^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(value ?? '')
  if (!match || match[3] === '*') return null
  return Number(match[3])
}

// Packages with an `exports` map hide `./package.json`, so walk up from the resolved entry point.
function findPackageJson(entryFile, packageName) {
  let dir = path.dirname(entryFile)
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, 'package.json')
    if (existsSync(candidate) && dir.endsWith(path.join(...packageName.split('/')))) return candidate
    dir = path.dirname(dir)
  }
  fail(`Не знайдено package.json для ${packageName}.`)
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function resolveRuntime() {
  const transformersPkgPath = findPackageJson(require.resolve('@huggingface/transformers'), '@huggingface/transformers')
  const transformersPkg = await readJson(transformersPkgPath)
  if (transformersPkg.version !== PIN.transformersVersion) {
    fail(
      `@huggingface/transformers ${transformersPkg.version} встановлено, а manifest розрахований на ${PIN.transformersVersion}. ` +
        'Перевірте package.json і lockfile.',
    )
  }
  const transformersRequire = createRequire(transformersPkgPath)
  const ortPkgPath = findPackageJson(transformersRequire.resolve('onnxruntime-web'), 'onnxruntime-web')
  const ortPkg = await readJson(ortPkgPath)
  const expectedOrt = transformersPkg.dependencies?.['onnxruntime-web']
  if (ortPkg.version !== expectedOrt) {
    fail(`onnxruntime-web ${ortPkg.version} не відповідає залежності transformers (${expectedOrt}).`)
  }
  return {
    transformersVersion: transformersPkg.version,
    transformersLicense: transformersPkg.license,
    ortVersion: ortPkg.version,
    ortLicense: ortPkg.license,
    ortDist: path.join(path.dirname(ortPkgPath), 'dist'),
  }
}

// transformers.js selects the asyncify build by default and the plain build on Safari.
const RUNTIME_FILES = [
  { file: 'ort-wasm-simd-threaded.asyncify.mjs', variant: 'asyncify', role: 'mjs' },
  { file: 'ort-wasm-simd-threaded.asyncify.wasm', variant: 'asyncify', role: 'wasm' },
  { file: 'ort-wasm-simd-threaded.mjs', variant: 'safari', role: 'mjs' },
  { file: 'ort-wasm-simd-threaded.wasm', variant: 'safari', role: 'wasm' },
]

async function copyRuntime(runtime) {
  const publicBase = `/ml-runtime/ort-${runtime.ortVersion}/`
  const outDir = path.join(ROOT, 'public', publicBase)
  await rm(path.join(ROOT, 'public/ml-runtime'), { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  const files = []
  for (const entry of RUNTIME_FILES) {
    const source = path.join(runtime.ortDist, entry.file)
    if (!existsSync(source)) fail(`У onnxruntime-web ${runtime.ortVersion} немає файла ${entry.file}.`)
    const bytes = await readFile(source)
    if (entry.role === 'wasm' && !(bytes[0] === 0x00 && bytes[1] === 0x61 && bytes[2] === 0x73 && bytes[3] === 0x6d)) {
      fail(`${entry.file} не є WebAssembly-модулем (немає сигнатури \\0asm).`)
    }
    if (entry.role === 'mjs' && /^\s*</.test(bytes.subarray(0, 64).toString('utf8'))) {
      fail(`${entry.file} схожий на HTML, а не на JavaScript.`)
    }
    await copyFile(source, path.join(outDir, entry.file))
    files.push({
      ...entry,
      path: `${publicBase}${entry.file}`,
      size: bytes.length,
      contentType: entry.role === 'wasm' ? 'application/wasm' : 'text/javascript',
    })
  }
  log(`runtime ${runtime.ortVersion}: скопійовано ${files.length} файли у public${publicBase}`)
  return { basePath: publicBase, files }
}

async function hfJson(url) {
  const response = await fetch(url)
  if (!response.ok) fail(`${url} → HTTP ${response.status}`)
  return response.json()
}

async function resolveModelFiles() {
  const { ModelRegistry } = await import('@huggingface/transformers')
  if (!ModelRegistry?.get_pipeline_files) {
    fail('Встановлена версія transformers не експортує ModelRegistry.get_pipeline_files.')
  }
  const requested = await ModelRegistry.get_pipeline_files(PIN.task, PIN.modelId, {
    dtype: PIN.dtype,
    device: PIN.device,
  })
  const info = await hfJson(`${HF}/api/models/${PIN.modelId}/revision/${PIN.revision}`)
  if (info.sha !== PIN.revision) fail(`Revision ${PIN.revision} моделі ${PIN.modelId} не знайдено (отримано ${info.sha}).`)
  const tree = await hfJson(`${HF}/api/models/${PIN.modelId}/tree/${PIN.revision}?recursive=true`)
  const sizes = new Map(tree.filter((e) => e.type === 'file').map((e) => [e.path, e.lfs?.size ?? e.size]))

  const files = []
  for (const file of requested) {
    const normalized = file.replace(/^\/+/, '')
    if (normalized.includes('..')) fail(`Небезпечний шлях від runtime: ${file}`)
    const required = !OPTIONAL_FILES.has(normalized)
    const size = sizes.get(normalized)
    if (size === undefined) {
      if (required) fail(`Runtime запитує ${normalized}, але цього файла немає на revision ${PIN.revision}.`)
      files.push({ path: normalized, kind: kindOf(normalized), required, size: null, upstream: 'missing' })
      continue
    }
    if (normalized in VERIFIED_SIZES && VERIFIED_SIZES[normalized] !== size) {
      fail(`${normalized}: розмір ${size} не збігається з перевіреним ${VERIFIED_SIZES[normalized]} для revision ${PIN.revision}.`)
    }
    files.push({ path: normalized, kind: kindOf(normalized), required, size, upstream: 'present' })
  }
  for (const verified of Object.keys(VERIFIED_SIZES)) {
    if (!files.some((f) => f.path === verified)) fail(`Runtime не запитує обов’язковий ${verified} для dtype ${PIN.dtype}.`)
  }
  return { files, license: info.cardData?.license_name ?? info.cardData?.license ?? 'unknown' }
}

// Simulates the browser GET: follows each redirect hop manually and checks CORS on every hop.
async function probeBrowserGet(file) {
  let url = `${HF}/${PIN.modelId}/resolve/${PIN.revision}/${file.path}`
  const hops = []
  for (let i = 0; i < 6; i++) {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { Origin: PROBE_ORIGIN, Range: 'bytes=0-0' },
    })
    const acao = response.headers.get('access-control-allow-origin')
    const host = new URL(url).host
    if (acao !== '*' && acao !== PROBE_ORIGIN) {
      fail(`${file.path}: ${host} відповів без дозволу CORS (Access-Control-Allow-Origin: ${acao ?? 'відсутній'}).`)
    }
    hops.push(host)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      await response.body?.cancel()
      if (!location) fail(`${file.path}: редирект ${response.status} без Location.`)
      url = new URL(location, url).href
      continue
    }
    const contentType = response.headers.get('content-type') ?? ''
    const contentRange = response.headers.get('content-range')
    await response.body?.cancel()
    if (response.status === 404) fail(`${file.path}: 404 на revision ${PIN.revision}.`)
    if (response.status !== 206 && response.status !== 200) fail(`${file.path}: неочікуваний HTTP ${response.status} від ${host}.`)
    if (/text\/html/i.test(contentType)) fail(`${file.path}: сервер повернув HTML замість файла моделі.`)
    if (response.status === 206) {
      const total = parseContentRangeTotal(contentRange)
      if (total !== null && file.size !== null && total !== file.size) {
        fail(`${file.path}: Content-Range повідомляє ${total} байт, а дерево репозиторію — ${file.size}.`)
      }
    }
    return { status: response.status, hops, contentType }
  }
  fail(`${file.path}: забагато редиректів.`)
}

async function main() {
  const runtime = await resolveRuntime()
  const runtimeAssets = await copyRuntime(runtime)

  let model
  try {
    model = await resolveModelFiles()
    for (const file of model.files) {
      if (file.upstream !== 'present') continue
      const probe = await probeBrowserGet(file)
      log(`${file.path}: HTTP ${probe.status} через ${probe.hops.join(' → ')}, CORS дозволено`)
    }
  } catch (error) {
    const isNetwork = !(error instanceof PrepareError)
    if (SOFT && isNetwork && existsSync(MANIFEST_PATH)) {
      const previous = await readJson(MANIFEST_PATH)
      if (previous.runtime?.basePath !== runtimeAssets.basePath) {
        fail(`Немає мережі, а збережений manifest вказує на інший runtime (${previous.runtime?.basePath}).`)
      }
      console.warn(`[prepare-model-assets] Мережа недоступна (${error.message}); використовую збережений manifest.`)
      return
    }
    throw error
  }

  const manifest = {
    schema: 1,
    task: PIN.task,
    modelId: PIN.modelId,
    revision: PIN.revision,
    dtype: PIN.dtype,
    device: PIN.device,
    maxNewTokens: 320,
    remoteHost: REMOTE_HOST,
    remotePathTemplate: REMOTE_PATH_TEMPLATE,
    proxy: null,
    cacheName: 'transformers-cache',
    library: {
      transformers: runtime.transformersVersion,
      onnxruntimeWeb: runtime.ortVersion,
    },
    licenses: {
      model: model.license,
      transformers: runtime.transformersLicense,
      onnxruntimeWeb: runtime.ortLicense,
    },
    reference: PIN.referenceSpace,
    files: model.files,
    runtime: runtimeAssets,
  }
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  const required = model.files.filter((f) => f.required)
  const bytes = required.reduce((sum, f) => sum + (f.size ?? 0), 0)
  log(`manifest: ${model.files.length} файлів моделі (${required.length} обов’язкових, ${bytes} байт) → lib/ml/model-manifest.json`)
}

main().catch((error) => {
  console.error(`\n[prepare-model-assets] ЗУПИНЕНО: ${error.message}\n`)
  process.exit(1)
})
