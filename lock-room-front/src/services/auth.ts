import { http } from '@/lib/http'
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/types/auth'

export const login = (payload: LoginPayload): Promise<LoginResponse> =>
  http.post('auth/login', { json: payload }).json<LoginResponse>()

export const register = (payload: RegisterPayload): Promise<RegisterResponse> =>
  http.post('auth/register', { json: payload }).json<RegisterResponse>()
