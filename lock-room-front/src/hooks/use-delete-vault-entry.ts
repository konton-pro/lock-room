import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vaultMutations } from '@/queries/vault'

export const DELETE_FAILED = 'DELETE_FAILED' as const

export type DeleteVaultEntryRequest = {
  id: string
  formattedId: string
  title: string | null
}

type UseDeleteVaultEntryOptions = {
  selectedCardId: string | null
  onCloseSelectedCard: () => void
}

export const useDeleteVaultEntry = ({
  selectedCardId,
  onCloseSelectedCard,
}: UseDeleteVaultEntryOptions) => {
  const queryClient = useQueryClient()
  const [pendingEntry, setPendingEntry] = useState<DeleteVaultEntryRequest | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useMutation({
    ...vaultMutations.delete(),
    onSuccess: async (_, deletedId) => {
      await queryClient.invalidateQueries({ queryKey: ['vault', 'list'] })
      queryClient.removeQueries({ queryKey: ['vault', 'detail', deletedId], exact: true })
      queryClient.removeQueries({ queryKey: ['vault', 'body', deletedId], exact: true })
      queryClient.removeQueries({ queryKey: ['vault', 'title', deletedId], exact: true })

      if (selectedCardId === deletedId) {
        onCloseSelectedCard()
      }

      setPendingEntry(null)
      setError(null)
    },
    onError: () => {
      setError(DELETE_FAILED)
    },
  })

  const requestDelete = (entry: DeleteVaultEntryRequest) => {
    setPendingEntry(entry)
    setError(null)
  }

  const cancelDelete = () => {
    if (isPending) return
    setPendingEntry(null)
    setError(null)
  }

  const confirmDelete = async () => {
    if (!pendingEntry) return
    setError(null)
    await mutateAsync(pendingEntry.id).catch(() => undefined)
  }

  return {
    pendingEntry,
    isDeleting: isPending,
    error,
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}
