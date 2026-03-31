import { ScrambleText } from '@/components/ui/scramble-text'

export const CtaSection = () => (
  <section className="py-32">
    <div className="page-wrap">
      <div className="flex flex-col items-center text-center gap-8">
        <p className="label-tag m-0" style={{ color: 'var(--text-muted)' }}>
          BEGIN_SECURE_SESSION
        </p>

        <h2
          className="m-0 font-bold uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            color: 'var(--text-primary)',
            letterSpacing: '0.08em',
            lineHeight: 1,
          }}
        >
          YOUR_SECRETS<br />
          STAY_YOURS
        </h2>

        <p
          className="max-w-lg text-xs leading-relaxed m-0"
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.9,
            fontFamily: 'var(--font-mono)',
          }}
        >
          No subscriptions. No tracking. No backdoors. Zero-knowledge
          architecture means we are structurally incapable of accessing
          your vault — not just legally prohibited.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <a href="#" className="btn-primary text-xs">
            [ <ScrambleText>INITIALIZE_SESSION</ScrambleText> ]
          </a>
        </div>

        <div
          className="w-full max-w-sm mt-8 p-4"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <p
            className="label-tag m-0 mb-2"
            style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}
          >
            INPUT_MASTER_HASH
          </p>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
          >
            <span style={{ color: 'var(--text-muted)' }}>{'>'}</span>
            <span style={{ color: '#4ade80' }}>ENTER_MASTER_KEY</span>
            <span className="cursor-blink" />
          </div>
          <div
            className="mt-3 pt-3 text-xs"
            style={{
              borderTop: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
            }}
          >
            BITS_PROCESSED: 0
          </div>
        </div>
      </div>
    </div>
  </section>
)
