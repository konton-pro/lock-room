import { Link } from '@tanstack/react-router'
import { useRecoverForm } from '@/hooks/use-recover-form'
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
  onBlur,
  type = 'text',
  placeholder,
  autoFocus,
  suffix,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
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
        <span className="flex-shrink-0 text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {'>'}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent outline-none text-sm tracking-widest"
          style={{ fontFamily: 'var(--font-mono)', color: '#4ade80', border: 'none', caretColor: '#4ade80' }}
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

export const RecoverForm = () => {
  const {
    step,
    verifyForm,
    resetForm,
    verifyError,
    resetError,
    resetVerify,
    resetReset,
    validateEmail,
    validateRecoveryKey,
    validatePassword,
    validateConfirmPassword,
  } = useRecoverForm()

  return (
    <div
      className="page-wrap w-full flex flex-col min-h-[calc(100vh-57px)]"
      style={{ paddingTop: '4rem', paddingBottom: '3rem' }}
    >
      <div className="flex flex-col gap-1 fade-in">
        {STATUS_INDICATORS.map(({ label, value }) => (
          <p key={label} className="label-tag m-0" style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em' }}>
            {label}: {value}
          </p>
        ))}
        <p className="label-tag m-0 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <span className="status-dot" style={{ background: '#f59e0b' }} />
          RECOVERY_MODE_ACTIVE
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 max-w-lg">
        <div className="fade-up" style={{ animationDelay: '100ms' }}>
          <p className="label-tag m-0 mb-4" style={{ color: 'var(--text-muted)' }}>
            {step === 'verify' ? 'RECOVERY_PROTOCOL' : 'SET_NEW_CREDENTIALS'}
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
            <span style={{ paddingLeft: '0.25em' }}>{step === 'verify' ? 'RECOVER' : 'NEW'}</span>
            <br />
            <span style={{ paddingLeft: '0.25em' }}>{step === 'verify' ? 'VAULT' : 'PASSWORD'}</span>
            <br />
            ]
          </h1>
        </div>

        {step === 'verify' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              verifyForm.handleSubmit()
            }}
            className="flex flex-col gap-6 fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <verifyForm.Field
              name="email"
              validators={{ onSubmit: ({ value }) => validateEmail(value) }}
            >
              {(field) => (
                <TerminalField
                  label="INPUT_IDENTIFIER"
                  value={field.state.value}
                  onChange={(v) => { if (verifyError) resetVerify(); field.handleChange(v) }}
                  onBlur={field.handleBlur}
                  type="email"
                  placeholder="user@domain.com"
                  autoFocus
                  error={field.state.meta.errors[0] as string | undefined}
                />
              )}
            </verifyForm.Field>

            <verifyForm.Field
              name="recoveryKey"
              validators={{ onSubmit: ({ value }) => validateRecoveryKey(value) }}
            >
              {(field) => (
                <TerminalField
                  label="INPUT_RECOVERY_KEY"
                  value={field.state.value}
                  onChange={(v) => { if (verifyError) resetVerify(); field.handleChange(v) }}
                  onBlur={field.handleBlur}
                  placeholder="xxxxxxxx-xxxxxxxx-..."
                  error={field.state.meta.errors[0] as string | undefined}
                />
              )}
            </verifyForm.Field>

            {verifyError && (
              <p className="label-tag m-0" style={{ color: '#ef4444', letterSpacing: '0.14em' }}>
                [ERROR] INVALID_CREDENTIALS — ACCESS_DENIED
              </p>
            )}

            <verifyForm.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="btn-primary w-full justify-center"
                  style={{ opacity: isSubmitting || !canSubmit ? 0.5 : 1, cursor: isSubmitting || !canSubmit ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? (
                    <>{'[ '}<span className="cursor-blink" style={{ background: 'currentColor' }} />{' PROCESSING ]'}</>
                  ) : (
                    <>[ <ScrambleText>VERIFY_KEY</ScrambleText> ]</>
                  )}
                </button>
              )}
            </verifyForm.Subscribe>

            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="label-tag transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                [ BACK_TO_LOGIN ]
              </Link>
            </div>
          </form>
        )}

        {step === 'reset' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              resetForm.handleSubmit()
            }}
            className="flex flex-col gap-6 fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <resetForm.Field
              name="newPassword"
              validators={{ onSubmit: ({ value }) => validatePassword(value) }}
            >
              {(field) => (
                <TerminalField
                  label="INPUT_NEW_MASTER_HASH"
                  value={field.state.value}
                  onChange={(v) => { if (resetError) resetReset(); field.handleChange(v) }}
                  onBlur={field.handleBlur}
                  type="password"
                  placeholder="enter new password"
                  autoFocus
                  error={field.state.meta.errors[0] as string | undefined}
                />
              )}
            </resetForm.Field>

            <resetForm.Field
              name="confirmPassword"
              validators={{
                onSubmit: ({ value, fieldApi }) =>
                  validateConfirmPassword(value, fieldApi.form.getFieldValue('newPassword')),
              }}
            >
              {(field) => (
                <TerminalField
                  label="CONFIRM_NEW_MASTER_HASH"
                  value={field.state.value}
                  onChange={(v) => { if (resetError) resetReset(); field.handleChange(v) }}
                  onBlur={field.handleBlur}
                  type="password"
                  placeholder="confirm new password"
                  error={field.state.meta.errors[0] as string | undefined}
                />
              )}
            </resetForm.Field>

            {resetError && (
              <p className="label-tag m-0" style={{ color: '#ef4444', letterSpacing: '0.14em' }}>
                [ERROR] RESET_FAILED — TRY_AGAIN
              </p>
            )}

            <resetForm.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="btn-primary w-full justify-center"
                  style={{ opacity: isSubmitting || !canSubmit ? 0.5 : 1, cursor: isSubmitting || !canSubmit ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? (
                    <>{'[ '}<span className="cursor-blink" style={{ background: 'currentColor' }} />{' PROCESSING ]'}</>
                  ) : (
                    <>[ <ScrambleText>RESET_VAULT</ScrambleText> ]</>
                  )}
                </button>
              )}
            </resetForm.Subscribe>
          </form>
        )}
      </div>

      <div className="flex justify-end fade-in" style={{ animationDelay: '400ms' }}>
        <HexParityGrid />
      </div>
    </div>
  )
}
