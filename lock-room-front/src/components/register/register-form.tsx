import { Link } from '@tanstack/react-router'
import { useRegisterForm } from '@/hooks/use-register-form'
import { HexParityGrid } from '@/components/ui/hex-parity-grid'
import { ScrambleText } from '@/components/ui/scramble-text'
import { RecoveryKeyModal } from '@/components/register/recovery-key-modal'

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
  const { form, showPassword, setShowPassword, isError, resetMutation, recoveryKey, onRecoveryAcknowledged } = useRegisterForm()

  const clearMutationError = () => {
    if (isError) resetMutation()
  }

  return (
    <div
      className="page-wrap w-full flex flex-col min-h-[calc(100vh-57px)]"
      style={{ paddingTop: '4rem', paddingBottom: '3rem' }}
    >
      {recoveryKey && <RecoveryKeyModal recoveryKey={recoveryKey} onAcknowledged={onRecoveryAcknowledged} />}
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
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-6 fade-up"
          style={{ animationDelay: '200ms' }}
        >
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-2">
                <div
                  className="relative"
                  style={{
                    border: `1px solid ${field.state.meta.errors.length ? '#ef4444' : 'var(--border-strong)'}`,
                    background: 'var(--surface)',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  <span
                    className="absolute top-0 left-4 label-tag px-1"
                    style={{
                      transform: 'translateY(-50%)',
                      background: 'var(--bg)',
                      color: field.state.meta.errors.length ? '#ef4444' : 'var(--text-muted)',
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
                      value={field.state.value}
                      onChange={(e) => {
                        clearMutationError()
                        field.handleChange(e.target.value)
                      }}
                      onBlur={field.handleBlur}
                      placeholder="your name"
                      autoComplete="name"
                      autoFocus
                      className="flex-1 bg-transparent outline-none text-sm tracking-widest"
                      style={{ fontFamily: 'var(--font-mono)', color: '#4ade80', border: 'none', caretColor: '#4ade80' }}
                    />
                  </div>
                </div>
                {field.state.meta.errors[0]?.message && (
                  <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
                    [ERROR] {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-2">
                <div
                  className="relative"
                  style={{
                    border: `1px solid ${field.state.meta.errors.length ? '#ef4444' : 'var(--border-strong)'}`,
                    background: 'var(--surface)',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  <span
                    className="absolute top-0 left-4 label-tag px-1"
                    style={{
                      transform: 'translateY(-50%)',
                      background: 'var(--bg)',
                      color: field.state.meta.errors.length ? '#ef4444' : 'var(--text-muted)',
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
                      value={field.state.value}
                      onChange={(e) => {
                        clearMutationError()
                        field.handleChange(e.target.value)
                      }}
                      onBlur={field.handleBlur}
                      placeholder="user@domain.com"
                      autoComplete="email"
                      className="flex-1 bg-transparent outline-none text-sm tracking-widest"
                      style={{ fontFamily: 'var(--font-mono)', color: '#4ade80', border: 'none', caretColor: '#4ade80' }}
                    />
                  </div>
                </div>
                {field.state.meta.errors[0]?.message && (
                  <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
                    [ERROR] {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-2">
                <div
                  className="relative"
                  style={{
                    border: `1px solid ${field.state.meta.errors.length ? '#ef4444' : 'var(--border-strong)'}`,
                    background: 'var(--surface)',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  <span
                    className="absolute top-0 left-4 label-tag px-1"
                    style={{
                      transform: 'translateY(-50%)',
                      background: 'var(--bg)',
                      color: field.state.meta.errors.length ? '#ef4444' : 'var(--text-muted)',
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
                      value={field.state.value}
                      onChange={(e) => {
                        clearMutationError()
                        field.handleChange(e.target.value)
                      }}
                      onBlur={field.handleBlur}
                      placeholder="enter password"
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
                  <CheckRow ok={field.state.value.length >= 8} label="MIN_8_CHARS" />
                </div>

                {field.state.meta.errors[0]?.message && (
                  <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
                    [ERROR] {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <div className="flex flex-col gap-2">
                <div
                  className="relative"
                  style={{
                    border: `1px solid ${field.state.meta.errors.length ? '#ef4444' : 'var(--border-strong)'}`,
                    background: 'var(--surface)',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  <span
                    className="absolute top-0 left-4 label-tag px-1"
                    style={{
                      transform: 'translateY(-50%)',
                      background: 'var(--bg)',
                      color: field.state.meta.errors.length ? '#ef4444' : 'var(--text-muted)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.18em',
                      transition: 'color 200ms ease',
                    }}
                  >
                    CONFIRM_MASTER_HASH
                  </span>
                  <div className="flex items-center gap-2 px-4 py-4">
                    <span className="flex-shrink-0 text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {'>'}
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={field.state.value}
                      onChange={(e) => {
                        clearMutationError()
                        field.handleChange(e.target.value)
                      }}
                      onBlur={field.handleBlur}
                      placeholder="confirm password"
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
                {field.state.meta.errors[0]?.message && (
                  <p className="label-tag m-0 px-1" style={{ color: '#ef4444' }}>
                    [ERROR] {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {isError && (
            <p className="label-tag m-0" style={{ color: '#ef4444', letterSpacing: '0.14em' }}>
              [ERROR] REGISTRATION_FAILED — TRY_AGAIN
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
                  <>[ <ScrambleText>CREATE_VAULT</ScrambleText> ]</>
                )}
              </button>
            )}
          </form.Subscribe>

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
