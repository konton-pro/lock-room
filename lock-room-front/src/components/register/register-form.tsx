import { Link } from '@tanstack/react-router'
import { useRegisterForm } from '@/hooks/use-register-form'
import { HexParityGrid } from '@/components/ui/hex-parity-grid'
import { ScrambleText } from '@/components/ui/scramble-text'

const STATUS_INDICATORS = [
  { label: 'SYS_STABILITY', value: '100%' },
  { label: 'ENC_PROTOCOL', value: 'AES-GCM-256' },
  { label: 'NODE_REGION', value: 'UNKNOWN' },
] as const

const CheckRow = ({ ok, label }: { ok: boolean; label: string }) => (
  <div className="flex items-center gap-3">
    <span
      className="label-tag flex-shrink-0"
      style={{
        color: ok ? '#4ade80' : 'var(--text-muted)',
        letterSpacing: '0.14em',
        transition: 'color 200ms ease',
      }}
    >
      {ok ? '[OK]' : '[--]'}
    </span>
    <span className="label-tag" style={{ color: ok ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
      {label}
    </span>
  </div>
)

export const RegisterForm = () => {
  const {
    name,
    email,
    password,
    showPassword,
    setShowPassword,
    isPending,
    isError,
    isReady,
    errors,
    checks,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    handleSubmit,
  } = useRegisterForm()

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
            NEW_IDENTITY_PROTOCOL
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
            <span style={{ paddingLeft: '0.25em' }}>CREATE</span>
            <br />
            <span style={{ paddingLeft: '0.25em' }}>VAULT</span>
            <br />
            ]
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 fade-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex flex-col gap-2">
            <div
              className="relative"
              style={{
                border: `1px solid ${errors.name ? '#ef4444' : 'var(--border-strong)'}`,
                background: 'var(--surface)',
                transition: 'border-color 200ms ease',
              }}
            >
              <span
                className="absolute top-0 left-4 label-tag px-1"
                style={{
                  transform: 'translateY(-50%)',
                  background: 'var(--bg)',
                  color: errors.name ? '#ef4444' : 'var(--text-muted)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                  transition: 'color 200ms ease',
                }}
              >
                INPUT_DISPLAY_NAME
              </span>
              <div className="flex items-center gap-2 px-4 py-4">
                <span className="flex-shrink-0 text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {'>'}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="YOUR_NAME"
                  autoComplete="name"
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-sm tracking-widest uppercase"
                  style={{ fontFamily: 'var(--font-mono)', color: '#4ade80', border: 'none', caretColor: '#4ade80' }}
                />
              </div>
            </div>
            {errors.name && (
              <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
                [ERROR] {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div
              className="relative"
              style={{
                border: `1px solid ${errors.email ? '#ef4444' : 'var(--border-strong)'}`,
                background: 'var(--surface)',
                transition: 'border-color 200ms ease',
              }}
            >
              <span
                className="absolute top-0 left-4 label-tag px-1"
                style={{
                  transform: 'translateY(-50%)',
                  background: 'var(--bg)',
                  color: errors.email ? '#ef4444' : 'var(--text-muted)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                  transition: 'color 200ms ease',
                }}
              >
                INPUT_IDENTIFIER
              </span>
              <div className="flex items-center gap-2 px-4 py-4">
                <span className="flex-shrink-0 text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {'>'}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="USER@DOMAIN.COM"
                  autoComplete="email"
                  className="flex-1 bg-transparent outline-none text-sm tracking-widest uppercase"
                  style={{ fontFamily: 'var(--font-mono)', color: '#4ade80', border: 'none', caretColor: '#4ade80' }}
                />
              </div>
            </div>
            {errors.email && (
              <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
                [ERROR] {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div
              className="relative"
              style={{
                border: `1px solid ${errors.password ? '#ef4444' : 'var(--border-strong)'}`,
                background: 'var(--surface)',
                transition: 'border-color 200ms ease',
              }}
            >
              <span
                className="absolute top-0 left-4 label-tag px-1"
                style={{
                  transform: 'translateY(-50%)',
                  background: 'var(--bg)',
                  color: errors.password ? '#ef4444' : 'var(--text-muted)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                  transition: 'color 200ms ease',
                }}
              >
                INPUT_MASTER_HASH
              </span>
              <div className="flex items-center gap-2 px-4 py-4">
                <span className="flex-shrink-0 text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {'>'}
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="ENTER_PASSWORD"
                  autoComplete="new-password"
                  className="flex-1 bg-transparent outline-none text-sm tracking-widest"
                  style={{ fontFamily: 'var(--font-mono)', color: '#4ade80', border: 'none', caretColor: '#4ade80' }}
                />
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
              </div>
            </div>

            <div className="flex flex-col gap-2 px-1 pt-1">
              <CheckRow ok={checks.password} label="MIN_8_CHARS" />
            </div>

            {errors.password && (
              <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
                [ERROR] {errors.password}
              </p>
            )}
          </div>

          {isError && (
            <p className="label-tag m-0" style={{ color: '#ef4444', letterSpacing: '0.14em' }}>
              [ERROR] REGISTRATION_FAILED — TRY_AGAIN
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !isReady}
            className="btn-primary w-full justify-center"
            style={{
              opacity: isPending || !isReady ? 0.5 : 1,
              cursor: isPending || !isReady ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? (
              <>{'[ '}<span className="cursor-blink" style={{ background: 'currentColor' }} />{' PROCESSING ]'}</>
            ) : (
              <>[ <ScrambleText>CREATE_VAULT</ScrambleText> ]</>
            )}
          </button>

          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="label-tag transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              [ ALREADY_HAVE_VAULT ]
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
