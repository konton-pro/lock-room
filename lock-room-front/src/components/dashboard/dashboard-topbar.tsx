import { useOperatorName } from '@/hooks/use-operator-name'
import { useLogout } from '@/hooks/use-logout'

export const DashboardTopBar = () => {
  const operatorName = useOperatorName()
  const logout = useLogout()

  return (
    <div
      className="flex items-center justify-between px-5 md:px-8"
      style={{
        borderBottom: '1px solid var(--border)',
        paddingTop: '0.875rem',
        paddingBottom: '0.875rem',
        background: 'var(--bg)',
        flexShrink: 0,
      }}
    >
      <div className="flex flex-col md:hidden">
        <span
          className="label-tag font-bold"
          style={{ color: 'var(--text-primary)', fontSize: '0.85rem', letterSpacing: '0.1em' }}
        >
          VAULT_01
        </span>
        <span className="label-tag" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
          {operatorName}
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
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
          onMouseEnter={(event) => (event.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(event) => (event.currentTarget.style.color = 'var(--text-muted)')}
        >
          CFG
        </button>
        <button type="button" className="btn-ghost text-xs" onClick={() => void logout()}>
          [ LOGOUT ]
        </button>
      </div>
    </div>
  )
}
