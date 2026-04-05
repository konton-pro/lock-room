import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getVaultItem } from '@/services/vault'
import { vaultKeyStore } from '@/stores/vault-key-store'
import { decryptVaultField } from '@/lib/crypto/vault-crypto'
import type { VaultListItem } from '@/services/vault'

export const useVaultCard = (item: VaultListItem) => {
  const [title, setTitle] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const masterKey = vaultKeyStore.getKey()
    if (!masterKey) {
      setTitle('[DECRYPT_FAILED]')
      return
    }
    decryptVaultField(item.encryptedHeader, item.clientIv, masterKey)
      .then(setTitle)
      .catch(() => setTitle('[DECRYPT_FAILED]'))
  }, [item.encryptedHeader, item.clientIv])

  const { mutate: fetchBody, isPending: loadingBody } = useMutation({
    mutationFn: async () => {
      const masterKey = vaultKeyStore.getKey()
      if (!masterKey) throw new Error('NO_MASTER_KEY')
      const full = await getVaultItem(item.cuid)
      return decryptVaultField(full.encryptedBody, full.clientIv, masterKey)
    },
    onSuccess: (decrypted) => {
      setBody(decrypted)
      setRevealed(true)
    },
    onError: () => {
      setBody('[DECRYPT_FAILED]')
      setRevealed(true)
    },
  })

  const reveal = () => {
    if (revealed) { setRevealed(false); return }
    if (body !== null) { setRevealed(true); return }
    fetchBody()
  }

  const copy = () => {
    if (!body) return
    navigator.clipboard.writeText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return { title, body, revealed, copied, loadingBody, reveal, copy }
}
