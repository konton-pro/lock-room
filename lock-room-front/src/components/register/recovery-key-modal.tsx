import { useState } from 'react'
import { formatRecoveryKey } from '@/lib/crypto/recovery-crypto'

export const RecoveryKeyModal = ({ recoveryKey, onAcknowledged }: { recoveryKey: string; onAcknowledged: () => void }) => {
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const formatted = formatRecoveryKey(recoveryKey)

  const copy = () => {
    navigator.clipboard.writeText(recoveryKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([`LOCK-ROOM RECOVERY KEY\n\n${formatted}\n\nStore this file in a safe place. Do not share it with anyone.`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lock-room-recovery-key.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '32rem',
          border: '1px solid var(--border-strong)',
          background: 'var(--surface)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="label-tag m-0" style={{ color: 'var(--text-muted)' }}>RECOVERY_KEY_GENERATED</p>
          <h2
            className="m-0 font-bold uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              lineHeight: 1.1,
            }}
          >
            [ SAVE YOUR KEY ]
          </h2>
        </div>

        <p className="label-tag m-0" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          THIS_KEY_RECOVERS_YOUR_VAULT — STORE_IT_SAFELY — CANNOT_BE_SHOWN_AGAIN
        </p>

        <div
          style={{
            border: '1px solid var(--border)',
            background: 'rgba(0,0,0,0.4)',
            padding: '1rem',
          }}
        >
          <p
            className="m-0 text-sm"
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#4ade80',
              letterSpacing: '0.1em',
              wordBreak: 'break-all',
              lineHeight: 1.8,
            }}
          >
            {formatted}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={copy}
            className="label-tag flex-1 transition-colors"
            style={{
              border: '1px solid var(--border-strong)',
              background: 'none',
              padding: '0.6rem',
              cursor: 'pointer',
              color: copied ? '#4ade80' : 'var(--text-muted)',
              transition: 'color 200ms ease, border-color 200ms ease',
            }}
            onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {copied ? '[ COPIED ]' : '[ COPY_KEY ]'}
          </button>
          <button
            type="button"
            onClick={download}
            className="label-tag flex-1 transition-colors"
            style={{
              border: '1px solid var(--border-strong)',
              background: 'none',
              padding: '0.6rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            [ DOWNLOAD ]
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setConfirmed((v) => !v)}
            className="label-tag flex-shrink-0 transition-colors"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: confirmed ? '#4ade80' : 'var(--text-muted)',
              padding: 0,
            }}
          >
            {confirmed ? '[OK]' : '[--]'}
          </button>
          <span className="label-tag" style={{ color: confirmed ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
            I_HAVE_SAVED_MY_RECOVERY_KEY
          </span>
        </div>

        <button
          type="button"
          onClick={onAcknowledged}
          disabled={!confirmed}
          className="btn-primary w-full justify-center"
          style={{
            opacity: confirmed ? 1 : 0.4,
            cursor: confirmed ? 'pointer' : 'not-allowed',
          }}
        >
          [ PROCEED_TO_LOGIN ]
        </button>
      </div>
    </div>
  )
}
