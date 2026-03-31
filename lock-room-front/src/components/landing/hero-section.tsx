import { ScrambleText } from '@/components/ui/scramble-text'
import { useHoverScramble } from '@/hooks/use-hover-scramble'
import { HexParityGrid } from '@/components/ui/hex-parity-grid'

const STATUS_INDICATORS = [
  { label: 'SYS_STABILITY', value: '100%' },
  { label: 'ENC_PROTOCOL', value: 'AES-GCM-256' },
  { label: 'NODE_REGION', value: 'UNKNOWN' },
] as const

export const HeroSection = () => {
  const { output: lockOutput, handlers: lockHandlers } = useHoverScramble('LOCK')
  const { output: roomOutput, handlers: roomHandlers } = useHoverScramble('ROOM')

  return (
    <section
      className="relative min-h-screen flex flex-col"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="page-wrap flex-1 flex flex-col pt-16 pb-12">
        <div className="flex flex-col gap-1 fade-in" style={{ animationDelay: '100ms' }}>
          {STATUS_INDICATORS.map(({ label, value }) => (
            <p
              key={label}
              className="label-tag m-0"
              style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em' }}
            >
              {label}: {value}
            </p>
          ))}
          <p className="label-tag m-0 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="status-dot" style={{ background: '#4ade80' }} />
            LINK_ESTABLISHED
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center py-12">
          <div className="fade-up" style={{ animationDelay: '200ms' }}>
            <h1
              className="m-0 font-bold uppercase leading-none cursor-default"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem, 14vw, 13rem)',
                color: 'var(--text-primary)',
                letterSpacing: '0.06em',
                lineHeight: 0.88,
              }}
            >
              [<br />
              <span style={{ paddingLeft: '0.25em', fontFamily: 'var(--font-mono)', display: 'inline-block' }}>
                <span {...lockHandlers}>{lockOutput}</span>
                {'-'}
                <span {...roomHandlers}>{roomOutput}</span>
              </span>
              <br />
              ]
            </h1>
          </div>

          <p
            className="label-tag mt-6 fade-up"
            style={{
              animationDelay: '350ms',
              letterSpacing: '0.22em',
              color: 'var(--text-secondary)',
              fontSize: '0.7rem',
            }}
          >
            ZERO_KNOWLEDGE_ARCHITECTURE_V.4.0.1
          </p>

          <p
            className="mt-8 fade-up max-w-xl"
            style={{
              animationDelay: '450ms',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              lineHeight: 1.8,
              fontFamily: 'var(--font-mono)',
            }}
          >
            A password vault where the server is structurally incapable of
            reading your data. Your secrets are encrypted before they ever
            leave your device.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 fade-up" style={{ animationDelay: '550ms' }}>
            <a href="#" className="btn-primary">
              [ <ScrambleText>INITIALIZE_SESSION</ScrambleText> ]
            </a>
            <a href="#architecture" className="btn-ghost">
              [ <ScrambleText>HOW_IT_WORKS</ScrambleText> ]
            </a>
          </div>
        </div>

        <div className="flex justify-end pb-4 fade-in" style={{ animationDelay: '700ms' }}>
          <HexParityGrid />
        </div>
      </div>
    </section>
  )
}
