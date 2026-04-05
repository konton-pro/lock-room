import { importRawKey } from '@/lib/crypto/keys'
import { fromBase64 } from '@/lib/crypto/encoding'

export const decryptVaultField = async (
  encryptedBase64: string,
  clientIvBase64: string,
  masterKeyHex: string,
): Promise<string> => {
  const key = await importRawKey(masterKeyHex)
  const iv = fromBase64(clientIvBase64)
  const combined = fromBase64(encryptedBase64)
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    combined,
  )
  return new TextDecoder().decode(plaintext)
}
