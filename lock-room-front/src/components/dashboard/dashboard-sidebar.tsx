import { Terminal } from 'lucide-react'
import { ScrambleText } from '@/components/ui/scramble-text'
import { useOperatorName } from '@/hooks/use-operator-name'

const NAV_ITEMS = [{ label: 'TERMINAL', Icon: Terminal, active: true }] as const

export const DashboardSidebar = () => {
  const operatorName = useOperatorName()

  return (
  <aside
    className="hidden md:flex md:flex-col"
    style={{
      width: '220px',
      flexShrink: 0,
      borderRight: '1px solid var(--border)',
      background: 'var(--bg)',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}
  >
    <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
      <p
        className="m-0 font-bold uppercase"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          color: 'var(--text-primary)',
          letterSpacing: '0.1em',
        }}
      >
        VAULT_01
      </p>
    </div>

    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
      <p
        className="m-0 label-tag"
        style={{ color: 'var(--text-primary)', fontSize: '0.7rem', letterSpacing: '0.12em' }}
      >
        {operatorName}
      </p>
      <p className="m-0 label-tag mt-1" style={{ color: 'var(--text-muted)' }}>
        ENTRIES_MODULE
      </p>
    </div>

    <nav className="flex flex-col" style={{ padding: '0.5rem 0' }}>
      {NAV_ITEMS.map(({ label, Icon, active }) => (
        <button
          key={label}
          type="button"
          className="flex items-center gap-3 label-tag"
          style={{
            padding: '0.75rem 1.25rem',
            background: active ? 'var(--surface-active)' : 'none',
            border: 'none',
            borderLeft: `2px solid ${active ? 'var(--text-primary)' : 'transparent'}`,
            cursor: 'pointer',
            color: active ? 'var(--text-primary)' : 'var(--text-muted)',
            textAlign: 'left',
            width: '100%',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <Icon size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <ScrambleText>{label}</ScrambleText>
        </button>
      ))}
    </nav>

    <div style={{ flex: 1 }} />

    <div style={{ height: '1rem' }} />
  </aside>
  )
}
