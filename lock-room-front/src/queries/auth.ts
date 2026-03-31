import { login, register } from '@/services/auth'
import type { LoginPayload, RegisterPayload } from '@/services/auth'

export const authMutations = {
  login: () => ({
    mutationFn: (payload: LoginPayload) => login(payload),
  }),
  register: () => ({
    mutationFn: (payload: RegisterPayload) => register(payload),
  }),
}
