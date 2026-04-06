import { useEffect, useSyncExternalStore } from 'react'
import { X } from 'lucide-react'
import { toastStore } from '@/stores/toast-store'
import type { Toast } from '@/stores/toast-store'

const PREFIX: Record<Toast['type'], string> = {
  error: '[ERROR]',
  success: '[OK]',
  warn: '[WARN]',
  info: '[INFO]',
}

const COLOR: Record<Toast['type'], string> = {
  error: '#ef4444',
  success: '#4ade80',
  warn: '#f59e0b',
  info: 'rgba(255, 255, 255, 0.55)',
}

const useAutoDismiss = (id: string, duration: number) => {
  useEffect(() => {
    const timer = setTimeout(() => toastStore.remove(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration])
}

const ToastItem = ({ toast }: { toast: Toast }) => {
  useAutoDismiss(toast.id, toast.duration)

  const color = COLOR[toast.type]

  return (
    <div
      className="fade-up"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        background: 'var(--surface)',
        border: `1px solid ${color}33`,
        borderLeft: `2px solid ${color}`,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.04em',
        maxWidth: '380px',
        minWidth: '260px',
      }}
    >
      <span style={{ color, flexShrink: 0 }}>{PREFIX[toast.type]}</span>
      <span
        style={{
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          wordBreak: 'break-word',
          flex: 1,
        }}
      >
        {toast.message}
      </span>
      <button
        onClick={() => toastStore.remove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--text-muted)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          marginTop: '1px',
        }}
      >
        <X size={12} />
      </button>
    </div>
  )
}

export const ToastContainer = () => {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot)

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
