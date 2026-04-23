
import { request } from './request'

export interface Memory {
  id: string
  session_id?: string
  summary: string
  key_insights?: Record<string, unknown>
  token_count?: number
  created_at: string
}

export interface MemoryListResponse {
  memories: Memory[]
  total: number
}

export interface MemorySearchResult {
  id: string
  session_id?: string
  memory_type: string
  content: string
  score: number
}

export function getMemories(params?: { limit?: number; offset?: number }) {
  return request.get<MemoryListResponse>('/memories', { params })
}

export function getMemory(memoryId: string) {
  return request.get<Memory>(`/memories/${memoryId}`)
}

export function searchMemories(params: { query: string; top_k?: number }) {
  return request.post<MemorySearchResult[]>('/memories/search', params)
}

export function createMemory(sessionId: string) {
  return request.post<Memory>('/memories/create', { session_id: sessionId })
}

export function deleteMemory(memoryId: string) {
  return request.delete(`/memories/${memoryId}`)
}

export function getMemoryContext(query: string) {
  return request.get<{ context: string }>(`/memories/context/${encodeURIComponent(query)}`)
}
