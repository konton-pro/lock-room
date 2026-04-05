import { toBase64, fromBase64 } from '@/lib/crypto/encoding'
import { importRawKey } from '@/lib/crypto/keys'

const ALGORITHM = 'AES-GCM'
const IV_LENGTH = 12
const TAG_LENGTH = 128
const TAG_BYTES = TAG_LENGTH / 8

export type EncryptedPayload = {
  encrypted: string
  iv: string
  tag: string
}

const generateIv = (): Uint8Array<ArrayBuffer> =>
  crypto.getRandomValues(new Uint8Array(IV_LENGTH)) as Uint8Array<ArrayBuffer>

export const encrypt = async (plaintext: ArrayBuffer, key: CryptoKey): Promise<EncryptedPayload> => {
  const iv = generateIv()
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    plaintext,
  )

  const tagStart = ciphertext.byteLength - TAG_BYTES

  return {
    encrypted: toBase64(ciphertext.slice(0, tagStart)),
    iv: toBase64(iv.buffer as ArrayBuffer),
    tag: toBase64(ciphertext.slice(tagStart)),
  }
}

export const decrypt = async (
  encryptedBase64: string,
  ivBase64: string,
  tagBase64: string,
  key: CryptoKey,
): Promise<ArrayBuffer> => {
  const encryptedData = new Uint8Array(fromBase64(encryptedBase64))
  const authTag = new Uint8Array(fromBase64(tagBase64))

  const combined = new Uint8Array(encryptedData.byteLength + authTag.byteLength)
  combined.set(encryptedData, 0)
  combined.set(authTag, encryptedData.byteLength)

  return crypto.subtle.decrypt(
    { name: ALGORITHM, iv: fromBase64(ivBase64), tagLength: TAG_LENGTH },
    key,
    combined.buffer as ArrayBuffer,
  )
}

export const encryptWithRawKey = async (
  plaintext: ArrayBuffer,
  rawKeyHex: string,
): Promise<EncryptedPayload> => encrypt(plaintext, await importRawKey(rawKeyHex))

export const decryptWithRawKey = async (
  encryptedBase64: string,
  ivBase64: string,
  tagBase64: string,
  rawKeyHex: string,
): Promise<ArrayBuffer> => decrypt(encryptedBase64, ivBase64, tagBase64, await importRawKey(rawKeyHex))
