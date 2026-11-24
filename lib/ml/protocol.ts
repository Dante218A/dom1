import type { FileEvent } from './progress'

export type ErrorCategory =
  | 'webgpu'
  | 'not-found'
  | 'cors'
  | 'mime'
  | 'network'
  | 'memory'
  | 'shader'
  | 'input'
  | 'model'

export interface RuntimeCheck {
  path: string
  role: 'mjs' | 'wasm'
  ok: boolean
  contentType: string | null
  detail: string
}

export type WorkerRequest =
  | { type: 'load'; runId: number }
  | { type: 'summarize'; runId: number; text: string }

export type WorkerResponse =
  | FileEvent
  | { type: 'worker-ready'; runId: number }
  | { type: 'runtime-check'; runId: number; check: RuntimeCheck }
  | { type: 'phase'; runId: number; phase: 'downloading' | 'warming' }
  | { type: 'ready'; runId: number; adapter: string | null; warmupMs: number }
  | { type: 'token'; runId: number; text: string }
  | { type: 'summary'; runId: number; text: string; inputTokens: number; outputTokens: number; ms: number }
  | { type: 'error'; runId: number; stage: 'load' | 'summarize'; category: ErrorCategory; message: string; file?: string }
