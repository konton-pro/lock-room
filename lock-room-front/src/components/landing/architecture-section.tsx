const STEPS = [
  {
    index: '01',
    label: 'KEY_DERIVATION',
    title: 'MASTER_KEY_NEVER_LEAVES',
    description:
      'You enter your master password. PBKDF2-SHA512 with 600k iterations derives an encryption key locally. The raw password is immediately discarded from memory.',
    detail: 'PBKDF2(password, salt, 600000, SHA-512) → encryption_key',
  },
  {
    index: '02',
    label: 'CLIENT_SIDE_ENCRYPTION',
    title: 'DATA_ENCRYPTED_LOCALLY',
    description:
      'Your vault entries are encrypted with AES-GCM-256 in your browser before any network call is made. The server receives only ciphertext and an authentication tag.',
    detail: 'AES-GCM(plaintext, encryption_key, iv) → ciphertext + tag',
  },
  {
    index: '03',
    label: 'DOUBLE_LAYER_ENCRYPTION',
    title: 'SERVER_ADDS_SECOND_LAYER',
    description:
      'The server applies its own AES-GCM-256 encryption on top of your already-encrypted data. Even if the database leaks, attackers face two independent encryption layers.',
    detail: 'server.encrypt(client_ciphertext, server_key) → L2_ciphertext',
  },
  {
    index: '04',
    label: 'RECOVERY_KEY',
    title: 'ZERO_KNOWLEDGE_RECOVERY',
    description:
      'Generate a recovery key stored only by you. It encrypts your master key client-side and sends the opaque blob to the server. Lost your password? Decrypt locally with the recovery key — the server never sees it.',
    detail: 'AES-GCM(master_key, recovery_key) → recovery_blob → server',
  },
] as const

export const ArchitectureSection = () => (
  <section id="architecture" className="py-24" style={{ borderBottom: '1px solid var(--border)' }}>
    <div className="page-wrap">
      <div className="mb-16">
        <p className="label-tag m-0 mb-3" style={{ color: 'var(--text-muted)' }}>
          ZERO_KNOWLEDGE_PROTOCOL
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
          HOW_IT_WORKS
        </h2>
      </div>

      <div className="flex flex-col gap-0">
        {STEPS.map(({ index, label, title, description, detail }, i) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-8 py-12"
            style={{
              borderTop: i > 0 ? '1px solid var(--border)' : undefined,
            }}
          >
            <div className="flex-shrink-0 md:w-16">
              <span
                className="font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1,
                }}
              >
                {index}
              </span>
            </div>

            <div className="flex-1">
              <p className="label-tag m-0 mb-2" style={{ color: 'var(--text-muted)' }}>
                {label}
              </p>
              <h3
                className="m-0 mb-4 font-bold tracking-wider text-sm"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              >
                {title}
              </h3>
              <p
                className="m-0 mb-6 text-xs leading-relaxed max-w-2xl"
                style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontFamily: 'var(--font-mono)' }}
              >
                {description}
              </p>
              <div
                className="inline-block px-4 py-2 text-xs"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                }}
              >
                {'> '}{detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
