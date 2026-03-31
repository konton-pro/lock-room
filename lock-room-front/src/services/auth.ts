export type LoginPayload = { email: string; password: string }
export type RegisterPayload = { name: string; email: string; password: string }

export const login = (_payload: LoginPayload): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 1200))

export const register = (_payload: RegisterPayload): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 1200))
