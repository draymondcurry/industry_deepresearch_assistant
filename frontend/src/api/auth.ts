
import { request } from './request'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  email: string
  password: string
}

export interface UserInfo {
  id: string
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: UserInfo
}

export function login(params: LoginParams) {
  return request.post<AuthResponse>('/auth/login', params)
}

export function register(params: RegisterParams) {
  return request.post<AuthResponse>('/auth/register', params)
}

export function getCurrentUser() {
  return request.get<UserInfo>('/auth/me')
}

export function logout() {
  return request.post('/auth/logout')
}

export function changePassword(params: { old_password: string; new_password: string }) {
  return request.post('/auth/change-password', params)
}
