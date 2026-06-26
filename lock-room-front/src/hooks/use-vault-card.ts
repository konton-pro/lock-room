import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { getVaultItem } from '@/services/vault'
import { vaultKeyStore } from '@/stores/vault-key-store'
import { decryptVaultField } from '@/lib/crypto/vault-crypto'
import type { VaultListItem } from '@/services/vault'

export const DECRYPT_FAILED = '[DECRYPT_FAILED]'

export const createVaultBodyQueryOptions = (item: VaultListItem) => ({
  queryKey: ['vault', 'body', item.cuid] as const,
  queryFn: async () => {
    const masterKey = vaultKeyStore.getKey()
    if (!masterKey) return DECRYPT_FAILED
    const full = await getVaultItem(item.cuid)
    return decryptVaultField(full.encryptedBody, full.clientIv, masterKey)
      .catch(() => DECRYPT_FAILED)
  },
  staleTime: Infinity,
  retry: false,
})

export const resolveVaultBodyForCopy = async ({
  body,
  queryClient,
  bodyQueryOptions,
}: {
  body: string | null
  queryClient: QueryClient
  bodyQueryOptions: ReturnType<typeof createVaultBodyQueryOptions>
}) => body ?? queryClient.fetchQuery(bodyQueryOptions)

export const useVaultCard = (item: VaultListItem) => {
  const queryClient = useQueryClient()
  const [revealed, setRevealed] = useState(false)
  const [copying, setCopying] = useState(false)
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const bodyQueryOptions = createVaultBodyQueryOptions(item)

  const { data: title = null } = useQuery({
    queryKey: ['vault', 'title', item.cuid],
    queryFn: () => {
      const masterKey = vaultKeyStore.getKey()
      if (!masterKey) return DECRYPT_FAILED
      return decryptVaultField(item.encryptedHeader, item.clientIv, masterKey)
        .catch(() => DECRYPT_FAILED)
    },
    retry: false,
  })

  const { data: body = null, isFetching: loadingBody } = useQuery({
    ...bodyQueryOptions,
    enabled: revealed,
  })

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const reveal = () => setRevealed((prev) => !prev)

  const triggerCopiedFeedback = () => {
    if (copiedTimeoutRef.current !== null) {
      clearTimeout(copiedTimeoutRef.current)
    }

    setCopied(true)
    copiedTimeoutRef.current = setTimeout(() => {
      setCopied(false)
      copiedTimeoutRef.current = null
    }, 1500)
  }

  const copy = async () => {
    if (copying || !navigator.clipboard?.writeText) return

    setCopying(true)

    try {
      const value = await resolveVaultBodyForCopy({
        body,
        queryClient,
        bodyQueryOptions,
      })

      if (!value || value === DECRYPT_FAILED) return

      await navigator.clipboard.writeText(value)
      triggerCopiedFeedback()
    } catch {
    } finally {
      setCopying(false)
    }
  }

  return { title, body, revealed, copying, copied, loadingBody, reveal, copy }
}
