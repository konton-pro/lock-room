import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { VaultListItem } from '@/services/vault'
import {
  createVaultBodyQueryOptions,
  decryptVaultTitle,
  isDecryptFailure,
  DECRYPT_FAILED,
} from './vault-card-utils'

const COPY_FEEDBACK_TIMEOUT_MS = 1500

export const useVaultCard = (item: VaultListItem) => {
  const queryClient = useQueryClient()
  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)

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

  const toggleReveal = () => setRevealed((value) => !value)

  const copy = async () => {
    if (!revealed) return
    const value = body ?? await queryClient.fetchQuery(bodyQueryOptions)
    if (!value || value === DECRYPT_FAILED) return
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT_MS)
  }

  return {
    title,
    body,
    revealed,
    copied,
    loadingBody,
    isTitleDecryptFailed: isDecryptFailure(title),
    isBodyDecryptFailed: isDecryptFailure(body),
    toggleReveal,
    copy,
  }
}
