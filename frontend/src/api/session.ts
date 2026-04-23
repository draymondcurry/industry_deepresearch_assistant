
import { AxiosRequestConfig } from 'axios'
import { request } from './request'

// ============ 新的会话管理 API ============

export interface Session {
  id: string
  title: string
  session_type: string
  created_at: string
  updated_at: string
  message_count: number
}

export interface Message {
  id: string
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  thinking?: string
  references_data?: Record<string, unknown>
  image_results?: Array<Record<string, unknown>>
  created_at: string
}

export interface SessionWithMessages extends Session {
  messages: Message[]
}

export interface CreateSessionParams {
  title?: string
  session_type?: 'chat' | 'deepsearch'
}

export interface UpdateSessionParams {
  title: string
}

export interface CreateMessageParams {
  role: 'user' | 'assistant' | 'system'
  content: string
  thinking?: string
  references_data?: Record<string, unknown>
  image_results?: Array<Record<string, unknown>>
}

export function getSessions(params?: { limit?: number; offset?: number; session_type?: string }) {
  return request.get<Session[]>('/sessions', { params, loading: false })
}

export function createSession(params?: CreateSessionParams) {
  return request.post<Session>('/sessions', params || {}, { loading: false })
}

export function getSession(sessionId: string) {
  return request.get<SessionWithMessages>(`/sessions/${sessionId}`, { loading: false })
}

export function updateSession(sessionId: string, params: UpdateSessionParams) {
  return request.put<Session>(`/sessions/${sessionId}`, params, { loading: false })
}

export function deleteSession(sessionId: string) {
  return request.delete(`/sessions/${sessionId}`, { loading: false })
}

export function getMessages(sessionId: string, params?: { limit?: number; offset?: number }) {
  return request.get<Message[]>(`/sessions/${sessionId}/messages`, { params })
}

export function addMessage(sessionId: string, params: CreateMessageParams) {
  return request.post<Message>(`/sessions/${sessionId}/messages`, params, { loading: false })
}

// ============ 旧的聊天 API（保持兼容） ============

export function create(params?: {}, options?: AxiosRequestConfig) {
  return request.post<
    API.Result<{
      session_id: string
    }>
  >(`/chat/session`, params, options)
}

export function chat(
  params: {
    session_id: string
    question: string
  },
  options?: AxiosRequestConfig,
) {
  return request.post<ReadableStream>('/chat/completion', params, {
    headers: {
      Accept: 'text/event-stream',
    },
    responseType: 'stream',
    adapter: 'fetch',
    loading: false,
    ...options,
  })
}

export function deepsearch(
  params: {
    query: string
    session_id?: string
    search_modes?: string[]  // 搜索模式: 'web' = 网络搜索, 'local' = 本地知识库
  },
  options?: AxiosRequestConfig,
) {
  return request.post<ReadableStream>('/research/stream', params, {
    headers: {
      Accept: 'text/event-stream',
    },
    responseType: 'stream',
    adapter: 'fetch',
    loading: false,
    ...options,
  })
}

// ============ 附件 API ============

export interface Attachment {
  id: string
  session_id: string
  message_id?: string
  filename: string
  file_type: string
  file_size: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
  created_at: string
}

export interface AttachmentListResponse {
  attachments: Attachment[]
  total: number
}

export function uploadAttachment(sessionId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('session_id', sessionId)
  return request.post<Attachment>('/attachments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function getAttachment(attachmentId: string) {
  return request.get<Attachment>(`/attachments/${attachmentId}`)
}

export function getSessionAttachments(sessionId: string) {
  return request.get<AttachmentListResponse>(`/attachments/session/${sessionId}`)
}

export function deleteAttachment(attachmentId: string) {
  return request.delete(`/attachments/${attachmentId}`)
}

export function chatWithAttachments(
  params: {
    session_id: string
    question: string
    attachment_ids?: string[]
  },
  options?: AxiosRequestConfig,
) {
  return request.post<ReadableStream>('/chat/completion/v3', params, {
    headers: {
      Accept: 'text/event-stream',
    },
    responseType: 'stream',
    adapter: 'fetch',
    loading: false,
    ...options,
  })
}

// ============ 研究控制 API ============

export function cancelResearch(sessionId: string) {
  return request.post<{ success: boolean; message: string }>(`/research/cancel/${sessionId}`, {}, { loading: false })
}

// ============ 研究检查点 API ============

export interface ResearchStep {
  type: string
  status: 'pending' | 'running' | 'completed'
  stats?: Record<string, number>
}

export interface ResearchUIState {
  research_steps: ResearchStep[]
  search_results: unknown[]
  charts: unknown[]
  knowledge_graph: unknown | null
  streaming_report: string
}

export interface ResearchCheckpoint {
  id: string
  session_id: string
  user_id: string | null
  query: string
  phase: string
  iteration: number
  status: 'running' | 'paused' | 'completed' | 'failed'
  error_message: string | null
  final_report: string | null
  state_json?: Record<string, unknown>
  ui_state_json?: ResearchUIState
  created_at: string
  updated_at: string
}

export function getResearchCheckpoint(sessionId: string) {
  return request.get<{ success: boolean; checkpoint?: ResearchCheckpoint; message?: string }>(
    `/research/checkpoint/${sessionId}`
  )
}

export function getFullResearchCheckpoint(sessionId: string) {
  return request.get<{ success: boolean; checkpoint?: ResearchCheckpoint; message?: string }>(
    `/research/checkpoint/${sessionId}/full`,
    { loading: false }
  )
}

export function listResearchCheckpoints(params?: { status?: string; limit?: number }) {
  return request.get<{ success: boolean; checkpoints: ResearchCheckpoint[]; total: number }>(
    '/research/checkpoints',
    { params }
  )
}
