type AuthListener = () => void

let listeners: AuthListener[] = []
let name: string | null = null

const notify = () => listeners.forEach((fn) => fn())

export const authStore = {
  getName: (): string | null => name,

  setName: (nextName: string): void => {
    if (nextName === name) return
    name = nextName
    notify()
  },

  clearSessionState: (): void => {
    if (name === null) return
    name = null
    notify()
  },

  subscribe: (listener: AuthListener): (() => void) => {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((fn) => fn !== listener)
    }
  },
}
