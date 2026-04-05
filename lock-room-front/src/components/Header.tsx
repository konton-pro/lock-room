import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { ScrambleText } from '@/components/ui/scramble-text'

const NAV_LINKS = ['FEATURES', 'ARCHITECTURE', 'SECURITY'] as const

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isAuthPage = pathname === '/login' || pathname === '/register'

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
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
              {NAV_LINKS.map((label) => (
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

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-xs">
              [ <ScrambleText>ACCESS_VAULT</ScrambleText> ]
            </Link>
            <Link to="/register" className="btn-primary text-xs">
              [ <ScrambleText>GET_ACCESS</ScrambleText> ]
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={closeMenu}
        />
      )}

      <aside
        className="fixed top-0 right-0 z-50 h-full flex flex-col gap-6 p-8 pt-20 md:hidden transition-transform duration-300"
        style={{
          width: '280px',
          background: 'var(--bg)',
          borderLeft: '1px solid var(--border)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <button
          type="button"
          className="absolute top-5 right-5"
          onClick={closeMenu}
          style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {!isAuthPage && (
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={closeMenu}
                className="label-tag transition-colors"
                style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-3 mt-auto">
          <Link to="/login" className="btn-ghost text-xs text-center justify-center" onClick={closeMenu}>
            [ ACCESS_VAULT ]
          </Link>
          <Link to="/register" className="btn-primary text-xs text-center justify-center" onClick={closeMenu}>
            [ GET_ACCESS ]
          </Link>
        </div>
      </aside>
    </>
  )
}
