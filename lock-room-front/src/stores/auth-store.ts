import Cookies from 'js-cookie'

const TOKEN_KEY = 'lock-room:token'
const NAME_KEY = 'lock-room:name'

const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: import.meta.env.PROD,
} as const

type AuthListener = () => void

let listeners: AuthListener[] = []

const notify = () => listeners.forEach((fn) => fn())

export const authStore = {
  getToken: (): string | null => Cookies.get(TOKEN_KEY) ?? null,

  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS)
    notify()
  },

  clearToken: (): void => {
    Cookies.remove(TOKEN_KEY)
    Cookies.remove(NAME_KEY)
    notify()
  },

  getName: (): string | null => Cookies.get(NAME_KEY) ?? null,

  setName: (name: string): void => {
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
