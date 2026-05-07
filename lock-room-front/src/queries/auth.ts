import { login, logout, register } from '@/services/auth'
import type { LoginPayload, RegisterPayload } from '@/types/auth'

export const authMutations = {
  login: () => ({
    mutationFn: (payload: LoginPayload) => login(payload),
  }),
  register: () => ({
    mutationFn: (payload: RegisterPayload) => register(payload),
  }),
  logout: () => ({
    mutationFn: () => logout(),
  }),
}
