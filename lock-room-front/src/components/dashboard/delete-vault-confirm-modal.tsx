import { DELETE_FAILED, type DeleteVaultEntryRequest } from '@/hooks/use-delete-vault-entry'

type DeleteVaultConfirmModalProps = {
  entry: DeleteVaultEntryRequest
  isDeleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export const DeleteVaultConfirmModal = ({
  entry,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteVaultConfirmModalProps) => (
  <div
    className="fixed inset-0 flex items-center justify-center p-4 md:p-8"
    style={{ zIndex: 70, background: 'rgba(0,0,0,0.84)', backdropFilter: 'blur(4px)' }}
    onClick={(event) => {
      if (event.target === event.currentTarget && !isDeleting) onCancel()
    }}
  >
    <section
      role="alertdialog"
      aria-modal="true"
      aria-label="Confirm vault entry deletion"
      className="w-full max-w-xl fade-up"
      style={{ border: '1px solid var(--border-strong)', background: 'var(--bg)' }}
    >
      <header
        className="flex items-start justify-between gap-3"
        style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}
      >
        <div className="min-w-0">
          <p className="m-0 label-tag" style={{ color: 'var(--text-muted)' }}>
            {entry.formattedId} / DELETE_REQUEST
          </p>
          <h2
            className="m-0 mt-2 font-bold uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.2rem, 2.6vw, 1.8rem)',
              letterSpacing: '0.06em',
              color: '#ef4444',
              lineHeight: 1.1,
            }}
          >
            {entry.title && entry.title !== '[DECRYPT_FAILED]' ? entry.title : 'UNAVAILABLE_TITLE'}
          </h2>
        </div>
        <button
          type="button"
          className="btn-ghost text-xs"
          onClick={onCancel}
          disabled={isDeleting}
          style={{ opacity: isDeleting ? 0.6 : 1 }}
        >
          [ CLOSE ]
        </button>
      </header>

      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        <div
          style={{
            border: '1px solid var(--border)',
            background: 'rgba(0,0,0,0.45)',
            padding: '1rem',
          }}
        >
          <p className="m-0 label-tag" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            THIS_ACTION_WILL_PERMANENTLY_DELETE_THIS_ENTRY.
          </p>
          <p className="m-0 mt-3 label-tag" style={{ color: '#ef4444', lineHeight: 1.8 }}>
            THIS_OPERATION_CANNOT_BE_UNDONE.
          </p>
        </div>

        {error === DELETE_FAILED && (
          <p className="m-0 mt-4 label-tag" style={{ color: '#ef4444' }}>
            [ERROR] {DELETE_FAILED}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={onCancel}
            disabled={isDeleting}
            style={{ opacity: isDeleting ? 0.6 : 1 }}
          >
            [ CANCEL ]
          </button>
          <button
            type="button"
            className="btn-primary text-xs"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
            style={{
              opacity: isDeleting ? 0.6 : 1,
              borderColor: '#ef4444',
              color: isDeleting ? '#fecaca' : '#fee2e2',
              background: isDeleting ? 'rgba(127, 29, 29, 0.7)' : 'rgba(153, 27, 27, 0.92)',
            }}
          >
            {isDeleting ? '[ DELETING ]' : '[ CONFIRM_DELETE ]'}
          </button>
        </div>
      </div>
    </section>
  </div>
)
