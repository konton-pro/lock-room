export default function Footer() {
  return (
    <footer
      className="border-t mt-0"
      style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
    >
      <div
        className="page-wrap flex flex-col sm:flex-row items-center justify-between py-4 gap-4"
        style={{ color: 'var(--text-muted)' }}
      >
        <div className="flex items-center gap-6 text-xs tracking-widest">
          <span>
            BITS_PROCESSED: 0 | STATUS: SECURE | SERVER_BLIND: TRUE
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs tracking-widest">
          <a
            href="https://lockroom.api.konton.pro"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            className="transition-colors"
          >
            [ DOCS ]
          </a>
          <a
            href="https://github.com/konton-pro/lock-room"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            className="transition-colors"
          >
            [ GITHUB ]
          </a>
          <span>© {new Date().getFullYear()} LOCK-ROOM</span>
        </div>
      </div>
    </footer>
  )
}
