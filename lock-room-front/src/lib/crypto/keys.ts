import { toHex, hexToBytes, toBase64 } from '@/lib/crypto/encoding'

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256

export const generateRandomKey = (): string =>
  toHex(crypto.getRandomValues(new Uint8Array(32)).buffer as ArrayBuffer)

export const sha256Hex = async (input: string): Promise<string> => {
  const encoded = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return toHex(hash)
}

export const deriveKeyFromPassword = async (
  password: string,
  salt: ArrayBuffer,
): Promise<CryptoKey> => {
  const encoded = new TextEncoder().encode(password)
  const baseKey = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveKey'])

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 600_000, hash: 'SHA-256' },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt'],
  )
}

export const importRawKey = (rawKeyHex: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    'raw',
    hexToBytes(rawKeyHex).buffer as ArrayBuffer,
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt'],
  )

export const exportKeyToBase64 = async (key: CryptoKey): Promise<string> =>
  toBase64(await crypto.subtle.exportKey('raw', key))
