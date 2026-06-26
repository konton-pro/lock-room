// @refresh reset
import { Copy, Eye, EyeOff, Expand } from 'lucide-react'
import type { VaultListItem } from '@/services/vault'
import { useVaultCard } from '@/hooks/use-vault-card'
import { VaultDetailModal } from './vault-detail-modal'

const formatId = (cuid: string) => `VT-${cuid.slice(-4).toUpperCase()}`

type VaultCardProps = {
  item: VaultListItem
  isSelected: boolean
  onOpenDetails: (id: string) => void
  onCloseDetails: () => void
}

const formatCreatedAt = (isoDate: string): string => {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return 'UNKNOWN_DATE'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}

export const VaultCard = ({
  item,
  isSelected,
  onOpenDetails,
  onCloseDetails,
}: VaultCardProps) => {
  const {
    title,
    body,
    revealed,
    copying,
    copied,
    loadingBody,
    isTitleDecryptFailed,
    isBodyDecryptFailed,
    toggleReveal,
    copy,
  } = useVaultCard(item)

  const preview = !revealed
    ? '••••••••••••••••'
    : loadingBody
      ? 'LOADING_CONTENT'
      : isBodyDecryptFailed
        ? 'DECRYPT_FAILED'
        : body ?? 'NO_CONTENT'

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${formatId(item.cuid)}`}
        aria-haspopup="dialog"
        aria-expanded={isSelected}
        className="fade-in"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '1.1rem 1.15rem',
          transition: 'border-color 180ms ease, background 180ms ease, transform 180ms ease',
          cursor: 'pointer',
          outline: 'none',
        }}
        onClick={() => onOpenDetails(item.cuid)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpenDetails(item.cuid)
          }
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = 'var(--text-primary)'
          event.currentTarget.style.background = 'var(--surface-hover)'
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = 'var(--border)'
          event.currentTarget.style.background = 'var(--surface)'
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.borderColor = 'var(--border-strong)'
          event.currentTarget.style.background = 'var(--surface-hover)'
          event.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.borderColor = 'var(--border)'
          event.currentTarget.style.background = 'var(--surface)'
          event.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="label-tag"
            style={{
              border: '1px solid var(--border-strong)',
              padding: '2px 8px',
              color: 'var(--text-secondary)',
            }}
          >
            [ ENTRY ]
          </span>
          <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
            {formatId(item.cuid)}
          </span>
        </div>

        <h3
          className="m-0 mb-3 font-bold uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: isTitleDecryptFailed ? '#ef4444' : 'var(--text-primary)',
            letterSpacing: '0.06em',
            lineHeight: 1.1,
          }}
        >
          {isTitleDecryptFailed ? 'DECRYPT_FAILED' : title ?? '···'}
        </h3>

        <p className="m-0 label-tag mb-2" style={{ color: 'var(--text-muted)' }}>
          CREATED_AT: {formatCreatedAt(item.createdAt)}
        </p>

        <div
          style={{
            border: '1px solid var(--border)',
            background: 'rgba(0,0,0,0.42)',
            padding: '0.7rem',
            minHeight: '88px',
          }}
        >
          <p
            className="m-0 text-sm"
            style={{
              color: !revealed ? 'var(--text-muted)' : isBodyDecryptFailed ? '#ef4444' : '#4ade80',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.45,
            }}
          >
            {preview}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            className="label-tag flex items-center gap-2 transition-colors"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0',
              whiteSpace: 'nowrap',
            }}
            onClick={(event) => {
              event.stopPropagation()
              onOpenDetails(item.cuid)
            }}
            onKeyDown={(event) => {
              event.stopPropagation()
            }}
            onMouseEnter={(event) => (event.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(event) => (event.currentTarget.style.color = 'var(--text-muted)')}
            aria-label="Open full view"
          >
            <Expand size={14} strokeWidth={1.6} />
            <span>OPEN</span>
          </button>

          <div className="flex items-center gap-4" style={{ whiteSpace: 'nowrap' }}>
            <button
              type="button"
              className="label-tag flex items-center gap-1.5 transition-colors"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: revealed ? '#4ade80' : 'var(--text-muted)',
                padding: '0',
                whiteSpace: 'nowrap',
              }}
              onClick={(event) => {
                event.stopPropagation()
                toggleReveal()
              }}
              onKeyDown={(event) => {
                event.stopPropagation()
              }}
              onMouseEnter={(event) => {
                if (!revealed) event.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(event) => {
                if (!revealed) event.currentTarget.style.color = 'var(--text-muted)'
              }}
              aria-label={revealed ? 'Hide content' : 'Reveal content'}
            >
              {revealed ? <EyeOff size={14} strokeWidth={1.6} /> : <Eye size={14} strokeWidth={1.6} />}
              <span>{revealed ? 'HIDE' : 'REVEAL'}</span>
            </button>

            <button
              type="button"
              disabled={copying}
              className="label-tag flex items-center gap-1.5 transition-colors"
              style={{
                background: 'none',
                border: 'none',
                cursor: copying ? 'wait' : 'pointer',
                color: copied ? '#4ade80' : 'var(--text-muted)',
                padding: '0',
                whiteSpace: 'nowrap',
              }}
              onClick={(event) => {
                event.stopPropagation()
                void copy()
              }}
              onKeyDown={(event) => {
                event.stopPropagation()
              }}
              onMouseEnter={(event) => {
                if (!copied && !copying) event.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(event) => {
                if (!copied && !copying) event.currentTarget.style.color = 'var(--text-muted)'
              }}
              aria-label="Copy content"
            >
              <Copy size={14} strokeWidth={1.6} />
              <span>{copied ? 'COPIED' : copying ? 'COPYING' : 'COPY'}</span>
            </button>
          </div>
        </div>
      </div>

      <VaultDetailModal
        isOpen={isSelected}
        onClose={onCloseDetails}
        title={title}
        body={body}
        createdAt={item.createdAt}
        formattedId={formatId(item.cuid)}
        revealed={revealed}
        onToggleReveal={toggleReveal}
        isLoading={loadingBody}
        isDecryptFailed={isBodyDecryptFailed}
        copied={copied}
        onCopy={copy}
      />
    </>
  )
}
