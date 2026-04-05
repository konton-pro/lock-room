import { generateRandomKey, sha256Hex } from '@/lib/crypto/keys'
import { encryptWithRawKey } from '@/lib/crypto/cipher'

export const generateRecoveryKey = (): string => generateRandomKey()

export const hashRecoveryKey = (recoveryKey: string): Promise<string> => sha256Hex(recoveryKey)

export const encryptMasterKeyWithRecoveryKey = (masterKey: string, recoveryKey: string) =>
  encryptWithRawKey(new TextEncoder().encode(masterKey).buffer as ArrayBuffer, recoveryKey)

export const formatRecoveryKey = (recoveryKey: string): string =>
  recoveryKey.match(/.{8}/g)?.join('-') ?? recoveryKey
