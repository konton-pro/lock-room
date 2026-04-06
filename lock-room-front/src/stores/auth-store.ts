import Cookies from 'js-cookie'

const TOKEN_KEY = 'lock-room:token'
const NAME_KEY = 'lock-room:name'

const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: import.meta.env.PROD,
} as const

const isClient = typeof document !== 'undefined'

type AuthListener = () => void

let listeners: AuthListener[] = []

const notify = () => listeners.forEach((fn) => fn())

export const authStore = {
  getToken: (): string | null => (isClient ? (Cookies.get(TOKEN_KEY) ?? null) : null),

  setToken: (token: string): void => {
    if (!isClient) return
    Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS)
    notify()
  },

  clearToken: (): void => {
    if (!isClient) return
    Cookies.remove(TOKEN_KEY)
    Cookies.remove(NAME_KEY)
    notify()
  },

  getName: (): string | null => (isClient ? (Cookies.get(NAME_KEY) ?? null) : null),

  setName: (name: string): void => {
    if (!isClient) return
    Cookies.set(NAME_KEY, name, COOKIE_OPTIONS)
  },

  isAuthenticated: (): boolean => authStore.getToken() !== null,

  subscribe: (listener: AuthListener): (() => void) => {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((fn) => fn !== listener)
    }
  },
}
