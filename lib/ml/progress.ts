export type FileState = 'pending' | 'loading' | 'cache' | 'verified' | 'error' | 'skipped'
export type FileKind = 'config' | 'graph' | 'weights' | 'tokenizer'

export interface ManifestFile {
  path: string
  kind: FileKind | string
  required: boolean
  size: number | null
  upstream: 'present' | 'missing' | string
}

export interface ResourceContext {
  modelId: string
  revision: string
  dtype: string
}

export interface ResourceEntry {
  key: string
  path: string
  kind: string
  required: boolean
  totalBytes: number | null
  loadedBytes: number
  networkBytes: number
  state: FileState
  source: 'network' | 'cache' | null
  cacheCandidate: boolean
  attempt: number
  retried: boolean
  fromManifest: boolean
  error: string | null
}

export interface ProgressState {
  runId: number
  context: ResourceContext
  entries: Map<string, ResourceEntry>
  order: string[]
  unexpected: string[]
}

export type FileEvent =
  | { type: 'file'; runId: number; status: 'initiate' | 'download' | 'done'; file: string }
  | { type: 'file'; runId: number; status: 'progress'; file: string; loaded: number; total?: number }
  | { type: 'cache-hit'; runId: number; file: string }
  | { type: 'file-error'; runId: number; file: string; reason: string }

export function normalizePath(file: string): string {
  const withoutQuery = file.split(/[?#]/, 1)[0]
  const segments = withoutQuery.split('/').filter((segment) => segment !== '' && segment !== '.')
  if (segments.some((segment) => segment === '..')) {
    throw new Error(`Небезпечний шлях ресурсу: ${file}`)
  }
  return segments.join('/')
}

export function canonicalKey(context: ResourceContext, file: string): string {
  return `${context.modelId}@${context.revision}:${context.dtype}:${normalizePath(file)}`
}

/**
 * Maps any resource URL (including signed redirect URLs with query strings) back to the
 * repository path, so the same file never appears twice in the registry.
 * Returns null for URLs outside the pinned model + revision.
 */
export function pathFromResourceUrl(url: string, context: ResourceContext): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const prefix = `/${context.modelId}/resolve/${encodeURIComponent(context.revision)}/`
  const pathname = decodeURIComponent(parsed.pathname)
  const decodedPrefix = decodeURIComponent(prefix)
  if (!pathname.startsWith(decodedPrefix)) return null
  return normalizePath(pathname.slice(decodedPrefix.length))
}

/** Total size of the whole file from a response, never the size of a partial range. */
export function totalBytesFromHeaders(status: number, headers: { get(name: string): string | null }): number | null {
  if (status === 206) {
    const match = /^bytes\s+\d+-\d+\/(\d+)$/i.exec(headers.get('content-range') ?? '')
    return match ? Number(match[1]) : null
  }
  if (status === 200) {
    // A compressed body reports encoded bytes while the stream yields decoded bytes.
    if (headers.get('content-encoding')) return null
    const length = headers.get('content-length')
    return length && /^\d+$/.test(length) ? Number(length) : null
  }
  return null
}

function makeEntry(context: ResourceContext, file: ManifestFile, attempt: number): ResourceEntry {
  const skipped = !file.required && file.upstream === 'missing'
  return {
    key: canonicalKey(context, file.path),
    path: normalizePath(file.path),
    kind: file.kind,
    required: file.required,
    totalBytes: file.size,
    loadedBytes: 0,
    networkBytes: 0,
    state: skipped ? 'skipped' : 'pending',
    source: null,
    cacheCandidate: false,
    attempt,
    retried: false,
    fromManifest: true,
    error: null,
  }
}

export function createProgressState(
  files: ManifestFile[],
  context: ResourceContext,
  runId: number,
  previous?: ProgressState,
): ProgressState {
  const entries = new Map<string, ResourceEntry>()
  const order: string[] = []
  for (const file of files) {
    const key = canonicalKey(context, file.path)
    const attempt = (previous?.entries.get(key)?.attempt ?? 0) + 1
    entries.set(key, makeEntry(context, file, attempt))
    order.push(key)
  }
  return { runId, context, entries, order, unexpected: [] }
}

function update(state: ProgressState, key: string, patch: Partial<ResourceEntry>): ProgressState {
  const current = state.entries.get(key)
  if (!current) return state
  const entries = new Map(state.entries)
  entries.set(key, { ...current, ...patch })
  return { ...state, entries }
}

function ensureEntry(state: ProgressState, file: string): { state: ProgressState; key: string } {
  const key = canonicalKey(state.context, file)
  if (state.entries.has(key)) return { state, key }
  const entries = new Map(state.entries)
  entries.set(key, {
    key,
    path: normalizePath(file),
    kind: 'unknown',
    required: true,
    totalBytes: null,
    loadedBytes: 0,
    networkBytes: 0,
    state: 'pending',
    source: null,
    cacheCandidate: false,
    attempt: 1,
    retried: false,
    fromManifest: false,
    error: null,
  })
  return {
    state: { ...state, entries, order: [...state.order, key], unexpected: [...state.unexpected, key] },
    key,
  }
}

export function applyEvent(state: ProgressState, event: FileEvent): ProgressState {
  if (event.runId !== state.runId) return state

  const ensured = ensureEntry(state, event.file)
  const next = ensured.state
  const key = ensured.key
  const entry = next.entries.get(key)!
  if (entry.state === 'error' && event.type !== 'file-error') return next

  if (event.type === 'cache-hit') {
    return update(next, key, { cacheCandidate: true })
  }
  if (event.type === 'file-error') {
    return update(next, key, { state: 'error', error: event.reason })
  }

  switch (event.status) {
    case 'initiate':
      return next
    case 'download':
      return update(next, key, { state: 'loading', source: entry.cacheCandidate ? 'cache' : 'network' })
    case 'progress': {
      const source = entry.source ?? (entry.cacheCandidate ? 'cache' : 'network')
      let totalBytes = entry.totalBytes
      if (totalBytes === null && !entry.fromManifest && event.total && event.loaded <= event.total) {
        totalBytes = event.total
      }
      const raw = Math.max(0, event.loaded)
      const loadedBytes = totalBytes === null ? raw : Math.min(raw, totalBytes)
      const retried = entry.retried || (loadedBytes < entry.loadedBytes && entry.loadedBytes > 0)
      return update(next, key, {
        state: entry.state === 'pending' ? 'loading' : entry.state,
        source,
        totalBytes,
        loadedBytes,
        networkBytes: source === 'network' ? loadedBytes : 0,
        retried,
      })
    }
    case 'done': {
      const source = entry.source ?? (entry.cacheCandidate ? 'cache' : 'network')
      const totalBytes = entry.totalBytes ?? (entry.loadedBytes > 0 ? entry.loadedBytes : null)
      const loadedBytes = totalBytes ?? entry.loadedBytes
      return update(next, key, {
        state: source === 'cache' ? 'cache' : 'verified',
        source,
        totalBytes,
        loadedBytes,
        networkBytes: source === 'network' ? loadedBytes : 0,
      })
    }
  }
}

export function markCancelled(state: ProgressState): ProgressState {
  const entries = new Map(state.entries)
  for (const [key, entry] of entries) {
    if (entry.state === 'loading' || entry.state === 'pending') {
      entries.set(key, { ...entry, state: 'error', error: 'Скасовано користувачем' })
    }
  }
  return { ...state, entries }
}

export interface ProgressSummary {
  determinate: boolean
  percent: number | null
  availableBytes: number
  totalBytes: number
  knownTotalBytes: number
  networkBytes: number
  doneCount: number
  requiredCount: number
  allRequiredDone: boolean
  hasError: boolean
}

export function summarize(state: ProgressState): ProgressSummary {
  const required = state.order
    .map((key) => state.entries.get(key)!)
    .filter((entry) => entry.required && entry.state !== 'skipped')
  const determinate = required.every((entry) => entry.totalBytes !== null) && state.unexpected.length === 0
  let availableBytes = 0
  let knownTotalBytes = 0
  let networkBytes = 0
  let doneCount = 0
  for (const entry of required) {
    knownTotalBytes += entry.totalBytes ?? 0
    networkBytes += entry.networkBytes
    const finished = entry.state === 'verified' || entry.state === 'cache'
    if (finished) doneCount += 1
    availableBytes += entry.totalBytes === null ? entry.loadedBytes : Math.min(entry.loadedBytes, entry.totalBytes)
  }
  const allRequiredDone = doneCount === required.length
  let percent: number | null = null
  if (determinate && knownTotalBytes > 0) {
    percent = Math.floor((100 * availableBytes) / knownTotalBytes)
    if (!allRequiredDone) percent = Math.min(percent, 99)
    percent = Math.max(0, Math.min(100, percent))
  }
  return {
    determinate,
    percent,
    availableBytes,
    totalBytes: knownTotalBytes,
    knownTotalBytes,
    networkBytes,
    doneCount,
    requiredCount: required.length,
    allRequiredDone,
    hasError: required.some((entry) => entry.state === 'error'),
  }
}

export function entryPercent(entry: ResourceEntry): number | null {
  if (entry.totalBytes === null || entry.totalBytes === 0) return null
  return Math.min(100, Math.floor((100 * entry.loadedBytes) / entry.totalBytes))
}
