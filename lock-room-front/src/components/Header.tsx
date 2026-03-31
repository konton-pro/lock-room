import { Link, useRouterState } from '@tanstack/react-router'
import { ScrambleText } from '@/components/ui/scramble-text'

export default function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--header-bg)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="page-wrap flex items-center justify-between py-4">
        <Link
          to="/"
          className="text-sm font-bold tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
        >
          [ <ScrambleText>LOCK-ROOM</ScrambleText> ]
        </Link>

        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-8">
            {(['FEATURES', 'ARCHITECTURE', 'SECURITY'] as const).map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="label-tag transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <ScrambleText>{label}</ScrambleText>
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-xs">
            [ <ScrambleText>ACCESS_VAULT</ScrambleText> ]
          </Link>
          <Link to="/register" className="btn-primary text-xs">
            [ <ScrambleText>GET_ACCESS</ScrambleText> ]
          </Link>
        </div>
      </div>
    </header>
  )
}
