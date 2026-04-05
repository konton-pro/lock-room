import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVaultItem } from '@/services/vault'
import { vaultKeyStore } from '@/stores/vault-key-store'
import { decryptVaultField } from '@/lib/crypto/vault-crypto'
import type { VaultListItem } from '@/services/vault'

const DECRYPT_FAILED = '[DECRYPT_FAILED]'

export const useVaultCard = (item: VaultListItem) => {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const { data: body = null, isPending: loadingBody } = useQuery({
    queryKey: ['vault', 'body', item.cuid],
    queryFn: async () => {
      const masterKey = vaultKeyStore.getKey()
      if (!masterKey) return DECRYPT_FAILED
      const full = await getVaultItem(item.cuid)
      return decryptVaultField(full.encryptedBody, full.clientIv, masterKey)
        .catch(() => DECRYPT_FAILED)
    },
  })

  const reveal = () => setRevealed((prev) => !prev)

  const copy = () => {
    if (!body || body === DECRYPT_FAILED) return
    navigator.clipboard.writeText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return { title, body, revealed, copied, loadingBody, reveal, copy }
}
