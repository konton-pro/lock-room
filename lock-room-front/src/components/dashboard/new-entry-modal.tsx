import { useState } from 'react'
import { X } from 'lucide-react'
import { ScrambleText } from '@/components/ui/scramble-text'
import { useNewEntry } from '@/hooks/use-new-entry'

const TerminalField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  multiline,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder: string
  multiline?: boolean
  error?: string
}) => (
  <div className="flex flex-col gap-2">
    <div
      className="relative"
      style={{
        border: `1px solid ${error ? '#ef4444' : 'var(--border-strong)'}`,
        background: 'var(--surface)',
        transition: 'border-color 200ms ease',
      }}
    >
      <span
        className="absolute top-0 left-4 label-tag px-1"
        style={{
          transform: 'translateY(-50%)',
          background: 'var(--bg)',
          color: error ? '#ef4444' : 'var(--text-muted)',
          fontSize: '0.6rem',
          letterSpacing: '0.18em',
          transition: 'color 200ms ease',
        }}
      >
        {label}
      </span>
      <div className="flex items-start gap-2 px-4 py-4">
        <span
          className="flex-shrink-0 text-sm"
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            paddingTop: multiline ? '1px' : undefined,
          }}
        >
          {'>'}
        </span>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="flex-1 bg-transparent outline-none text-sm tracking-widest resize-none"
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#4ade80',
              border: 'none',
              caretColor: '#4ade80',
            }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm tracking-widest"
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#4ade80',
              border: 'none',
              caretColor: '#4ade80',
              textTransform: 'uppercase',
            }}
          />
        )}
      </div>
    </div>
    {error && (
      <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
        [ERROR] {error}
      </p>
    )}
  </div>
)

export const NewEntryModal = ({ onClose }: { onClose: () => void }) => {
  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [keyHex, setKeyHex] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { submit, isPending, generatedKey, error, setError } = useNewEntry(onClose)

  const encKey = keyHex || generatedKey

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (!header.trim()) errors.header = 'REQUIRED'
    if (!body.trim()) errors.body = 'REQUIRED'
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    try {
      await submit(header.trim(), body.trim(), encKey)
    } catch {
      setError('ENCRYPTION_FAILED — CHECK_KEY_FORMAT')
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 50, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="flex flex-col w-full max-w-xl fade-up"
        style={{
          border: '1px solid var(--border-strong)',
          background: 'var(--bg)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <p className="label-tag m-0" style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
              VAULT_01 / NEW_ENTRY
            </p>
            <h2
              className="m-0 font-bold uppercase"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                letterSpacing: '0.08em',
                lineHeight: 1,
              }}
            >
              STORE_ENTRY
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="transition-colors"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          style={{ padding: '1.5rem' }}
        >
          <TerminalField
            label="ENTRY_TITLE"
            value={header}
            onChange={(v) => {
              setHeader(v)
              setFieldErrors((prev) => ({ ...prev, header: '' }))
            }}
            placeholder="label your entry"
            error={fieldErrors.header}
          />

          <TerminalField
            label="ENTRY_BODY"
            value={body}
            onChange={(v) => {
              setBody(v)
              setFieldErrors((prev) => ({ ...prev, body: '' }))
            }}
            placeholder="secret content"
            multiline
            error={fieldErrors.body}
          />

          <div className="flex flex-col gap-2">
            <div
              className="relative"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <span
                className="absolute top-0 left-4 label-tag px-1"
                style={{
                  transform: 'translateY(-50%)',
                  background: 'var(--bg)',
                  color: 'var(--text-muted)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                }}
              >
                ENCRYPTION_KEY
              </span>
              <div className="flex items-center gap-2 px-4 py-3">
                <span
                  className="flex-1 text-xs"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.08em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {encKey}
                </span>
                <button
                  type="button"
                  className="label-tag flex-shrink-0 transition-colors"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '0 2px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  onClick={() => navigator.clipboard.writeText(encKey)}
                >
                  [CPY]
                </button>
              </div>
            </div>
            <p className="label-tag m-0 px-1" style={{ color: 'var(--text-muted)' }}>
              ⚠ SAVE_THIS_KEY — REQUIRED_TO_DECRYPT
            </p>
            <div className="flex items-center gap-2">
              <span className="label-tag" style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
                CUSTOM_KEY:
              </span>
              <input
                type="text"
                value={keyHex}
                onChange={(e) => setKeyHex(e.target.value.toLowerCase())}
                placeholder="64 hex chars or leave empty"
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  padding: '4px 0',
                  letterSpacing: '0.08em',
                }}
              />
            </div>
          </div>

          {error && (
            <p className="label-tag m-0" style={{ color: '#ef4444', letterSpacing: '0.14em' }}>
              [ERROR] {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary text-xs flex-1 justify-center"
              style={{
                opacity: isPending ? 0.5 : 1,
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? (
                <>
                  {'[ '}
                  <span className="cursor-blink" style={{ background: 'currentColor' }} />
                  {' ENCRYPTING ]'}
                </>
              ) : (
                <>[ <ScrambleText>STORE_ENTRY</ScrambleText> ]</>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs"
              style={{ flexShrink: 0 }}
            >
              [ CANCEL ]
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
