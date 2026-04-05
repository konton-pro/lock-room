import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vaultMutations } from '@/queries/vault'
import { generateRandomKey, importRawKey } from '@/lib/crypto/keys'
import { toBase64 } from '@/lib/crypto/encoding'

const encryptField = async (plaintext: string, key: CryptoKey, iv: Uint8Array): Promise<string> => {
  const encoded = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, encoded)
  return toBase64(ciphertext as ArrayBuffer)
}

export const useNewEntry = (onClose: () => void) => {
  const queryClient = useQueryClient()
  const [generatedKey] = useState(() => generateRandomKey())
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useMutation({
    ...vaultMutations.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'list'] })
      onClose()
    },
  })

  const submit = async (header: string, body: string, keyHex: string) => {
    setError(null)
    const key = await importRawKey(keyHex)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const clientIv = toBase64(iv.buffer as ArrayBuffer)
    const encryptedHeader = await encryptField(header, key, iv)
    const encryptedBody = await encryptField(body, key, iv)
    await mutateAsync({ encryptedHeader, encryptedBody, clientIv })
  }

  return { submit, isPending, generatedKey, error, setError }
}
