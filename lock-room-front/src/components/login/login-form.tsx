import { Link } from '@tanstack/react-router'
import { useLoginForm } from '@/hooks/use-login-form'
import { HexParityGrid } from '@/components/ui/hex-parity-grid'
import { ScrambleText } from '@/components/ui/scramble-text'

const STATUS_INDICATORS = [
  { label: 'SYS_STABILITY', value: '100%' },
  { label: 'ENC_PROTOCOL', value: 'AES-GCM-256' },
  { label: 'NODE_REGION', value: 'UNKNOWN' },
] as const

const TerminalField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoFocus,
  suffix,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder: string
  autoFocus?: boolean
  suffix?: React.ReactNode
  error?: string
}) => (
  <div className="flex flex-col gap-2">
    <div
      className="relative"
      style={{
        border: `1px solid ${error ? '#ef4444' : 'var(--border-strong)'}`,
        background: 'var(--surface)',
        transition: 'border-color 200ms ease',
      }}
    >
      <span
        className="absolute top-0 left-4 label-tag px-1"
        style={{
          transform: 'translateY(-50%)',
          background: 'var(--bg)',
          color: error ? '#ef4444' : 'var(--text-muted)',
          fontSize: '0.6rem',
          letterSpacing: '0.18em',
          transition: 'color 200ms ease',
        }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 px-4 py-4">
        <span
          className="flex-shrink-0 text-sm"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          {'>'}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={type === 'password' ? 'current-password' : 'email'}
          className="flex-1 bg-transparent outline-none text-sm tracking-widest"
          style={{
            fontFamily: 'var(--font-mono)',
            color: '#4ade80',
            border: 'none',
            caretColor: '#4ade80',
          }}
        />
        {suffix}
      </div>
    </div>
    {error && (
      <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
        [ERROR] {error}
      </p>
    )}
  </div>
)

export const LoginForm = () => {
  const { form, showPassword, setShowPassword, isError, resetMutation } = useLoginForm()

  return (
    <div
      className="page-wrap w-full flex flex-col min-h-[calc(100vh-57px)]"
      style={{ paddingTop: '4rem', paddingBottom: '3rem' }}
    >
      <div className="flex flex-col gap-1 fade-in">
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

      <div className="flex-1 flex flex-col justify-center py-12 max-w-lg">
        <div className="fade-up" style={{ animationDelay: '100ms' }}>
          <p className="label-tag m-0 mb-4" style={{ color: 'var(--text-muted)' }}>
            AUTHENTICATION_REQUIRED
          </p>
          <h1
            className="m-0 mb-10 font-bold uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              lineHeight: 0.9,
            }}
          >
            [<br />
            <span style={{ paddingLeft: '0.25em' }}>VAULT</span>
            <br />
            <span style={{ paddingLeft: '0.25em' }}>ACCESS</span>
            <br />
            ]
          </h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isError) resetMutation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-6 fade-up"
          style={{ animationDelay: '200ms' }}
        >
          <form.Field name="email">
            {(field) => (
              <TerminalField
                label="INPUT_IDENTIFIER"
                value={field.state.value}
                onChange={(v) => {
                  if (isError) resetMutation()
                  field.handleChange(v)
                }}
                type="email"
                placeholder="user@domain.com"
                autoFocus
                error={field.state.meta.errors[0]?.message}
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <TerminalField
                label="INPUT_MASTER_HASH"
                value={field.state.value}
                onChange={(v) => {
                  if (isError) resetMutation()
                  field.handleChange(v)
                }}
                type={showPassword ? 'text' : 'password'}
                placeholder="enter password"
                error={field.state.meta.errors[0]?.message}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex-shrink-0 label-tag transition-colors"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {showPassword ? '[HIDE]' : '[SHOW]'}
                  </button>
                }
              />
            )}
          </form.Field>

          {isError && (
            <p
              className="label-tag m-0"
              style={{ color: '#ef4444', letterSpacing: '0.14em' }}
            >
              [ERROR] INVALID_CREDENTIALS — ACCESS_DENIED
            </p>
          )}

          <form.Subscribe selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}>
            {({ canSubmit, isSubmitting }) => (
              <button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="btn-primary w-full justify-center"
                style={{
                  opacity: isSubmitting || !canSubmit ? 0.5 : 1,
                  cursor: isSubmitting || !canSubmit ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>{'[ '}<span className="cursor-blink" style={{ background: 'currentColor' }} />{' PROCESSING ]'}</>
                ) : (
                  <>[ <ScrambleText>INITIALIZE_SESSION</ScrambleText> ]</>
                )}
              </button>
            )}
          </form.Subscribe>

          <div className="flex items-center justify-between">
            <Link
              to="/register"
              className="label-tag transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              [ CREATE_VAULT ]
            </Link>
            <Link
              to="/recover"
              className="label-tag transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              [ RECOVER_VAULT ]
            </Link>
            <Link
              to="/"
              className="label-tag transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              [ BACK_TO_SURFACE ]
            </Link>
          </div>
        </form>
      </div>

      <div className="flex justify-end fade-in" style={{ animationDelay: '400ms' }}>
        <HexParityGrid />
      </div>
    </div>
  )
}
