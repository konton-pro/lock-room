export type ToastType = 'error' | 'success' | 'warn' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

type ToastListener = () => void

let toasts: Toast[] = []
let listeners: ToastListener[] = []

const notify = () => listeners.forEach((fn) => fn())

export const toastStore = {
  add: (message: string, type: ToastType = 'info', duration = 4000): string => {
    const id = crypto.randomUUID()
    toasts = [...toasts, { id, message, type, duration }]
    notify()
    return id
  },

  remove: (id: string): void => {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  },

  getSnapshot: (): Toast[] => toasts,

  subscribe: (listener: ToastListener): (() => void) => {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((fn) => fn !== listener)
    }
  },
}
