export type StoreRecoveryPayload = {
  encryptedPayload: string
  iv: string
  tag: string
  recoveryKeyHash: string
}

export type StoreRecoveryResponse = {
  cuid: string
}

export type RecoveryStatusResponse = {
  hasRecoveryKey: boolean
  createdAt: string | null
}

export type VerifyRecoveryPayload = {
  email: string
  recoveryKeyHash: string
}

export type VerifyRecoveryResponse = {
  encryptedPayload: string
  iv: string
  tag: string
}

export type ResetRecoveryPayload = {
  email: string
  recoveryKeyHash: string
  newPassword: string
  newEncryptedPayload: string
  newIv: string
  newTag: string
}
