import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { vaultQueries } from '@/queries/vault'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardTopBar } from './dashboard-topbar'
import { DashboardVaultContent } from './dashboard-vault-content'
import { DashboardFooterMetrics } from './dashboard-footer-metrics'
import { NewEntryModal } from './new-entry-modal'
import { DeleteVaultConfirmModal } from './delete-vault-confirm-modal'
import { getLatestCreatedAt } from './dashboard-utils'
import { useDeleteVaultEntry } from '@/hooks/use-delete-vault-entry'

export const DashboardPage = () => {
  const { data: items = [], isLoading } = useQuery(vaultQueries.list())
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const {
    pendingEntry,
    isDeleting,
    error: deleteError,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useDeleteVaultEntry({
    selectedCardId,
    onCloseSelectedCard: () => setSelectedCardId(null),
  })

  const latestCreatedAt = useMemo(() => getLatestCreatedAt(items), [items])

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {isNewEntryOpen && <NewEntryModal onClose={() => setIsNewEntryOpen(false)} />}
      {pendingEntry && (
        <DeleteVaultConfirmModal
          entry={pendingEntry}
          isDeleting={isDeleting}
          error={deleteError}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
      <DashboardSidebar />

      <div className="flex flex-col flex-1" style={{ overflow: 'hidden' }}>
        <DashboardTopBar />

        <div className="flex-1 p-4 md:p-8" style={{ overflowY: 'auto' }}>
          <div className="flex items-start justify-between gap-4 mb-6 fade-in">
            <div>
              <h1
                className="m-0 font-bold uppercase"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 6vw, 3.5rem)',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                ACTIVE_VAULT
              </h1>
              <p className="label-tag m-0 mt-2" style={{ color: 'var(--text-secondary)' }}>
                TOTAL_ENTRIES: {String(items.length).padStart(2, '0')}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary text-xs"
              style={{ flexShrink: 0 }}
              onClick={() => setIsNewEntryOpen(true)}
            >
              [ NEW_ENTRY ]
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 2rem' }} />

          <DashboardVaultContent
            items={items}
            isLoading={isLoading}
            selectedCardId={selectedCardId}
            onOpenCard={setSelectedCardId}
            onCloseCard={() => setSelectedCardId(null)}
            onRequestDelete={requestDelete}
            deletingId={isDeleting ? pendingEntry?.id ?? null : null}
          />

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0 1rem' }} />

          <DashboardFooterMetrics totalItems={items.length} latestCreatedAt={latestCreatedAt} />
        </div>
      </div>
    </div>
  )
}
