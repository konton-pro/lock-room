import { getVaultItem } from '@/services/vault'
import { decryptVaultField } from '@/lib/crypto/vault-crypto'
import { vaultKeyStore } from '@/stores/vault-key-store'
import type { VaultListItem } from '@/services/vault'

export const DECRYPT_FAILED = '[DECRYPT_FAILED]' as const

export const decryptVaultTitle = async (item: VaultListItem): Promise<string> => {
  const masterKey = vaultKeyStore.getKey()
  if (!masterKey) return DECRYPT_FAILED
  return decryptVaultField(item.encryptedHeader, item.clientIv, masterKey)
    .catch(() => DECRYPT_FAILED)
}

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

export const isDecryptFailure = (value: string | null): boolean =>
  value === DECRYPT_FAILED
