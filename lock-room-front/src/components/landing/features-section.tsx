import { ScrambleText } from '@/components/ui/scramble-text'

const FEATURES = [
  {
    id: 'AES_GCM_256',
    title: 'AES-GCM-256',
    category: 'ENCRYPTION',
    description:
      'Every credential is encrypted with AES-GCM-256 before storage. The same cipher trusted by military and intelligence agencies worldwide.',
  },
  {
    id: 'ZERO_KNOWLEDGE',
    title: 'ZERO_KNOWLEDGE',
    category: 'ARCHITECTURE',
    description:
      'The server holds only ciphertext. Without your master key, the data is mathematically indistinguishable from random noise.',
  },
  {
    id: 'PBKDF2_SHA512',
    title: 'PBKDF2_SHA512',
    category: 'KEY_DERIVATION',
    description:
      'Your master password is never transmitted. It derives a local encryption key via 600,000 PBKDF2 iterations with SHA-512.',
  },
  {
    id: 'SERVER_BLIND',
    title: 'SERVER_BLIND',
    category: 'PRIVACY',
    description:
      'The backend processes only opaque blobs. No plaintext, no metadata, no behavioral analytics. Structural privacy by design.',
  },
  {
    id: 'CLIENT_SIDE_CRYPTO',
    title: 'CLIENT_SIDE_CRYPTO',
    category: 'EXECUTION',
    description:
      'All cryptographic operations run inside your browser or native client. The network sees only encrypted payloads.',
  },
  {
    id: 'OPEN_PROTOCOL',
    title: 'OPEN_PROTOCOL',
    category: 'TRANSPARENCY',
    description:
      'The encryption protocol is fully documented and open source. Verify every claim independently. No security through obscurity.',
  },
] as const

export const FeaturesSection = () => (
  <section id="features" className="py-24" style={{ borderBottom: '1px solid var(--border)' }}>
    <div className="page-wrap">
      <div className="mb-16">
        <p className="label-tag m-0 mb-3" style={{ color: 'var(--text-muted)' }}>
          SYSTEM_CAPABILITIES
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
          SECURITY_FEATURES
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
        {FEATURES.map(({ id, title, category, description }) => (
          <article
            key={id}
            className="p-8 transition-colors"
            style={{ background: 'var(--bg)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg)')}
          >
            <p className="label-tag m-0 mb-3" style={{ color: 'var(--text-muted)' }}>
              {category}
            </p>
            <h3
              className="m-0 mb-4 font-bold tracking-wider text-sm"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
            >
              <ScrambleText>{title}</ScrambleText>
            </h3>
            <p
              className="m-0 text-xs leading-relaxed"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-mono)' }}
            >
              {description}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
)
