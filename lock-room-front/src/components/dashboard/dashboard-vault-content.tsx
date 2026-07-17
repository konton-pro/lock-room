import type { VaultListItem } from '@/services/vault'
import type { DeleteVaultEntryRequest } from '@/hooks/use-delete-vault-entry'
import { VaultCard } from './vault-card'

type DashboardVaultContentProps = {
  items: VaultListItem[]
  isLoading: boolean
  selectedCardId: string | null
  onOpenCard: (id: string) => void
  onCloseCard: () => void
  onRequestDelete: (entry: DeleteVaultEntryRequest) => void
  deletingId: string | null
}

export const DashboardVaultContent = ({
  items,
  isLoading,
  selectedCardId,
  onOpenCard,
  onCloseCard,
  onRequestDelete,
  deletingId,
}: DashboardVaultContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 fade-in">
        <span className="cursor-blink" />
        <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
          LOADING_VAULT_ENTRIES
        </span>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        className="fade-in"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '1.5rem',
        }}
      >
        <p className="m-0 label-tag" style={{ color: 'var(--text-muted)' }}>
          NO_ENTRIES_FOUND. CREATE_YOUR_FIRST_ENTRY.
        </p>
      </div>
    )
  }

  return (
    <div
      className="fade-up"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
      }}
    >
      {items.map((item) => (
        <VaultCard
          key={item.cuid}
          item={item}
          isSelected={selectedCardId === item.cuid}
          onOpenDetails={onOpenCard}
          onCloseDetails={onCloseCard}
          onRequestDelete={onRequestDelete}
          isDeleting={deletingId === item.cuid}
        />
      ))}
    </div>
  )
}
