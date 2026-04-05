import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vaultMutations } from '@/queries/vault'
import { importRawKey } from '@/lib/crypto/keys'
import { toBase64 } from '@/lib/crypto/encoding'
import { vaultKeyStore } from '@/stores/vault-key-store'

const encryptField = async (plaintext: string, key: CryptoKey, iv: Uint8Array<ArrayBuffer>): Promise<string> => {
  const encoded = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, encoded.buffer as ArrayBuffer)
  return toBase64(ciphertext as ArrayBuffer)
}

export const useNewEntry = (onClose: () => void) => {
  const queryClient = useQueryClient()
  const masterKey = vaultKeyStore.getKey() ?? ''
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useMutation({
    ...vaultMutations.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'list'] })
      onClose()
    },
  })

  const submit = async (header: string, body: string) => {
    setError(null)
    const key = await importRawKey(masterKey)
    const iv = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>
    const clientIv = toBase64(iv.buffer as ArrayBuffer)
    const encryptedHeader = await encryptField(header, key, iv)
    const encryptedBody = await encryptField(body, key, iv)
    await mutateAsync({ encryptedHeader, encryptedBody, clientIv })
  }

  return { submit, isPending, masterKey, error, setError }
}
