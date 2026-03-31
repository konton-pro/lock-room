const SECURITY_SPECS: { label: string; value: string; danger?: boolean }[] = [
  { label: 'CIPHER', value: 'AES-GCM-256' },
  { label: 'KEY_DERIVATION', value: 'PBKDF2-SHA512' },
  { label: 'ITERATIONS', value: '600,000' },
  { label: 'IV_LENGTH', value: '96 BITS' },
  { label: 'TAG_LENGTH', value: '128 BITS' },
  { label: 'TRANSPORT', value: 'TLS 1.3' },
  { label: 'SERVER_KNOWLEDGE', value: 'NONE' },
  { label: 'PLAINTEXT_STORAGE', value: 'NEVER', danger: true },
]

const AUDIT_ITEMS = [
  { status: 'VERIFIED', label: 'CRYPTOGRAPHIC_PROTOCOL' },
  { status: 'VERIFIED', label: 'CLIENT_SIDE_ONLY_CRYPTO' },
  { status: 'VERIFIED', label: 'NO_TELEMETRY' },
  { status: 'VERIFIED', label: 'OPEN_SOURCE_CODE' },
] as const

export const SecuritySection = () => (
  <section id="security" className="py-24" style={{ borderBottom: '1px solid var(--border)' }}>
    <div className="page-wrap">
      <div className="mb-16">
        <p className="label-tag m-0 mb-3" style={{ color: 'var(--text-muted)' }}>
          CRYPTOGRAPHIC_PARAMETERS
        </p>
        <h2
          className="m-0 font-bold uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            color: 'var(--text-primary)',
            letterSpacing: '0.1em',
          }}
        >
          SECURITY_SPECS
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="grid grid-cols-1 gap-px" style={{ background: 'var(--border)' }}>
            {SECURITY_SPECS.map(({ label, value, danger }) => (
              <div
                key={label}
                className="flex items-center justify-between px-6 py-4"
                style={{ background: 'var(--bg)' }}
              >
                <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </span>
                <span
                  className="text-xs font-bold tracking-wider"
                  style={{
                    color: danger ? '#ef4444' : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="label-tag m-0 mb-6" style={{ color: 'var(--text-muted)' }}>
            AUDIT_CHECKLIST
          </p>

          <div className="flex flex-col gap-4">
            {AUDIT_ITEMS.map(({ status, label }) => (
              <div key={label} className="flex items-center gap-4">
                <span
                  className="text-xs tracking-widest font-bold flex-shrink-0"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                >
                  [{status}]
                </span>
                <span
                  className="label-tag"
                  style={{ color: 'var(--text-secondary)', letterSpacing: '0.14em' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-12 p-6"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <p className="label-tag m-0 mb-3" style={{ color: 'var(--text-muted)' }}>
              THREAT_MODEL
            </p>
            <p
              className="m-0 text-xs leading-relaxed"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontFamily: 'var(--font-mono)' }}
            >
              Even if the server infrastructure is fully compromised, attackers
              gain only meaningless encrypted blobs. Without your master
              password, brute-forcing 600k PBKDF2 iterations per attempt is
              computationally infeasible at any scale.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)
