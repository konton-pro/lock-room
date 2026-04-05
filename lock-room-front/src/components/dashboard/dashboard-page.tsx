import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { vaultQueries } from '@/queries/vault'
import { DashboardSidebar } from './dashboard-sidebar'
import { VaultCard } from './vault-card'
import { NewEntryModal } from './new-entry-modal'

const TopBar = () => (
  <div
    className="flex items-center justify-between"
    style={{
      borderBottom: '1px solid var(--border)',
      padding: '0.875rem 2rem',
      background: 'var(--bg)',
      flexShrink: 0,
    }}
  >
    <nav className="flex items-center gap-8">
      <span
        className="label-tag"
        style={{
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--text-primary)',
          paddingBottom: '3px',
        }}
      >
        DASHBOARD
      </span>
    </nav>

    <div className="flex items-center gap-4">
      <button
        type="button"
        className="label-tag transition-colors"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          padding: '0.25rem',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        ⚙
      </button>
      <Link to="/" className="btn-ghost text-xs">
        [ LOGOUT ]
      </Link>
    </div>
  </div>
)

export const DashboardPage = () => {
  const { data: items = [], isLoading } = useQuery(vaultQueries.list())
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  const openNewEntry = () => setIsNewEntryOpen(true)

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {isNewEntryOpen && <NewEntryModal onClose={() => setIsNewEntryOpen(false)} />}
      <DashboardSidebar />

      <div className="flex flex-col flex-1" style={{ overflow: 'hidden' }}>
        <TopBar />

        <div className="flex-1" style={{ padding: '2rem', overflowY: 'auto' }}>
          <div className="flex items-start justify-between mb-6 fade-in">
            <div>
              <h1
                className="m-0 font-bold uppercase"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                ACTIVE_VAULT
              </h1>
              <p className="label-tag m-0 mt-2" style={{ color: 'var(--text-secondary)' }}>
                SUB_PROTOCOL: 0X882A / STATUS: SECURE
              </p>
            </div>
            <button
              type="button"
              className="btn-primary text-xs"
              onClick={openNewEntry}
            >
              [ NEW_ENTRY ]
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 2rem' }} />

          {isLoading ? (
            <div className="flex items-center gap-3 fade-in">
              <span className="cursor-blink" />
              <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
                LOADING_VAULT_ENTRIES
              </span>
            </div>
          ) : (
            <div
              className="fade-up"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {items.map((item) => (
                <VaultCard key={item.cuid} item={item} />
              ))}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0 1rem' }} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
                TOTAL_KEYS: {String(items.length).padStart(2, '0')}
              </span>
              <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
                REDUNDANCY: 3X
              </span>
              <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
                ENCRYPTION: AES-4096-XTS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="status-dot"
                style={{ background: '#4ade80', width: '6px', height: '6px' }}
              />
              <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
                SYSTEM_LINK: ESTABLISHED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
