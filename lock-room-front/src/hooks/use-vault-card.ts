import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import type { VaultListItem } from '@/services/vault'
import {
  createVaultBodyQueryOptions,
  decryptVaultTitle,
  isDecryptFailure,
  DECRYPT_FAILED,
} from './vault-card-utils'

const COPY_FEEDBACK_TIMEOUT_MS = 1500

export { createVaultBodyQueryOptions, DECRYPT_FAILED } from './vault-card-utils'

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
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const bodyQueryOptions = createVaultBodyQueryOptions(item)

  const { data: title = null } = useQuery({
    queryKey: ['vault', 'title', item.cuid],
    queryFn: () => decryptVaultTitle(item),
    retry: false,
    staleTime: Infinity,
  })

  const { data: body = null, isFetching: loadingBody } = useQuery({
    ...bodyQueryOptions,
    enabled: revealed,
    retry: false,
  })

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const toggleReveal = () => setRevealed((value) => !value)

  const triggerCopiedFeedback = () => {
    if (copiedTimeoutRef.current !== null) {
      clearTimeout(copiedTimeoutRef.current)
    }

    setCopied(true)
    copiedTimeoutRef.current = setTimeout(() => {
      setCopied(false)
      copiedTimeoutRef.current = null
    }, COPY_FEEDBACK_TIMEOUT_MS)
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
      // Keep the card state unchanged when copy prerequisites fail.
    } finally {
      setCopying(false)
    }
  }

  return {
    title,
    body,
    revealed,
    copying,
    copied,
    loadingBody,
    isTitleDecryptFailed: isDecryptFailure(title),
    isBodyDecryptFailed: isDecryptFailure(body),
    toggleReveal,
    copy,
  }
}
