const TOKEN_KEY = 'lock-room:token'

type AuthListener = () => void

let listeners: AuthListener[] = []

const notify = () => listeners.forEach((fn) => fn())

export const authStore = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
    notify()
  },

  clearToken: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    notify()
  },

  isAuthenticated: (): boolean => authStore.getToken() !== null,

  subscribe: (listener: AuthListener): (() => void) => {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((fn) => fn !== listener)
    }
  },
}
