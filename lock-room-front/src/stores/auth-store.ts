const TOKEN_KEY = 'lock-room:token'
const NAME_KEY = 'lock-room:name'

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
    localStorage.removeItem(NAME_KEY)
    notify()
  },

  getName: (): string | null => localStorage.getItem(NAME_KEY),

  setName: (name: string): void => {
    localStorage.setItem(NAME_KEY, name)
  },

  isAuthenticated: (): boolean => authStore.getToken() !== null,

  subscribe: (listener: AuthListener): (() => void) => {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((fn) => fn !== listener)
    }
  },
}
