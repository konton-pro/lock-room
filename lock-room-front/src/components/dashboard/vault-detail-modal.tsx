import { useEffect } from 'react'

type VaultDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string | null
  body: string | null
  createdAt: string
  formattedId: string
  revealed: boolean
  onToggleReveal: () => void
  isLoading: boolean
  isDecryptFailed: boolean
  copied: boolean
  onCopy: () => Promise<void>
  onRequestDelete: () => void
  isDeleting: boolean
}

const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return 'UNKNOWN'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export const VaultDetailModal = ({
  isOpen,
  onClose,
  title,
  body,
  createdAt,
  formattedId,
  revealed,
  onToggleReveal,
  isLoading,
  isDecryptFailed,
  copied,
  onCopy,
  onRequestDelete,
  isDeleting,
}: VaultDetailModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-8"
      style={{ zIndex: 60, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(3px)' }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Vault entry details"
        className="w-full max-w-4xl fade-up"
        style={{ border: '1px solid var(--border-strong)', background: 'var(--bg)' }}
      >
        <header
          className="flex items-start justify-between gap-3"
          style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}
        >
          <div className="min-w-0">
            <p className="m-0 label-tag" style={{ color: 'var(--text-muted)' }}>
              {formattedId} / {formatDateTime(createdAt)}
            </p>
            <h2
              className="m-0 mt-2 font-bold uppercase"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 2.6vw, 1.8rem)',
                letterSpacing: '0.06em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {title && title !== '[DECRYPT_FAILED]' ? title : 'UNAVAILABLE_TITLE'}
            </h2>
          </div>
          <button type="button" className="btn-ghost text-xs" onClick={onClose}>
            [ CLOSE ]
          </button>
        </header>

        <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          <div
            style={{
              border: '1px solid var(--border)',
              background: 'rgba(0,0,0,0.45)',
              minHeight: '360px',
              maxHeight: '62vh',
              overflowY: 'auto',
              padding: '1rem',
            }}
          >
            {isLoading ? (
              <p className="m-0 label-tag" style={{ color: 'var(--text-muted)' }}>
                LOADING_ENTRY_CONTENT
              </p>
            ) : !revealed ? (
              <p className="m-0 label-tag" style={{ color: 'var(--text-muted)' }}>
                CONTENT_HIDDEN. CLICK_REVEAL_TO_VIEW.
              </p>
            ) : isDecryptFailed ? (
              <p className="m-0 label-tag" style={{ color: '#ef4444' }}>
                [ERROR] DECRYPT_FAILED
              </p>
            ) : (
              <p
                className="m-0"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'var(--font-mono)',
                  color: '#4ade80',
                  lineHeight: 1.65,
                  letterSpacing: '0.01em',
                }}
              >
                {body}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mt-4">
            <p className="m-0 label-tag" style={{ color: 'var(--text-muted)' }}>
              {revealed ? 'FULL_CONTENT_VIEW' : 'CONTENT_PROTECTED'}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-ghost text-xs"
                onClick={onRequestDelete}
                disabled={isDeleting}
                style={{
                  opacity: isDeleting ? 0.6 : 1,
                  borderColor: '#7f1d1d',
                  color: '#fca5a5',
                }}
              >
                {isDeleting ? '[ DELETING ]' : '[ DELETE_ENTRY ]'}
              </button>
              <button
                type="button"
                className="btn-ghost text-xs"
                onClick={onToggleReveal}
              >
                {revealed ? '[ HIDE_CONTENT ]' : '[ REVEAL_CONTENT ]'}
              </button>
              <button
                type="button"
                className="btn-primary text-xs"
                onClick={() => void onCopy()}
                disabled={!revealed || isLoading || isDecryptFailed || !body}
                style={{ opacity: !revealed || isLoading || isDecryptFailed || !body ? 0.6 : 1 }}
              >
                {copied ? '[ COPIED ]' : '[ COPY_CONTENT ]'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
