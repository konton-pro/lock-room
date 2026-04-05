import type { VaultListItem } from '@/services/vault'
import { useVaultCard } from '@/hooks/use-vault-card'

const formatId = (cuid: string) => `VT-${cuid.slice(-4).toUpperCase()}`

export const VaultCard = ({ item }: { item: VaultListItem }) => {
  const { title, body, revealed, copied, loadingBody, reveal, copy } = useVaultCard(item)

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '1.25rem',
        transition: 'border-color 200ms ease, background 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)'
        e.currentTarget.style.background = 'var(--surface-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--surface)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="label-tag"
          style={{ border: '1px solid var(--border-strong)', padding: '2px 8px', color: 'var(--text-secondary)' }}
        >
          {revealed ? '[ UNLOCKED ]' : '[ LOCKED ]'}
        </span>
        <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
          ID: {formatId(item.cuid)}
        </span>
      </div>

      <h3
        className="m-0 mb-4 font-bold uppercase"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.15rem',
          color: title ? 'var(--text-primary)' : 'var(--text-muted)',
          letterSpacing: '0.06em',
          lineHeight: 1.1,
        }}
      >
        {title ?? '···'}
      </h3>

      <div
        className="flex items-center gap-2"
        style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,0.4)', padding: '0.6rem 0.75rem' }}
      >
        <span
          className="flex-1 text-sm"
          style={{
            fontFamily: 'var(--font-mono)',
            color: revealed ? '#4ade80' : 'var(--text-muted)',
            letterSpacing: revealed ? '0.05em' : '0.2em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {revealed ? body : '••••••••••••'}
        </span>

        <button
          type="button"
          onClick={reveal}
          disabled={loadingBody}
          className="label-tag flex-shrink-0 transition-colors"
          style={{ background: 'none', border: 'none', cursor: loadingBody ? 'wait' : 'pointer', color: 'var(--text-muted)', padding: '0 2px' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          {loadingBody ? '[···]' : revealed ? '[HIDE]' : '[VIEW]'}
        </button>

        <button
          type="button"
          onClick={copy}
          className="label-tag flex-shrink-0 transition-colors"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: copied ? '#4ade80' : 'var(--text-muted)',
            padding: '0 2px',
          }}
          onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          {copied ? '[OK]' : '[CPY]'}
        </button>
      </div>
    </div>
  )
}
