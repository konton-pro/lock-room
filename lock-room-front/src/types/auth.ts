export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  name: string
  encryptedMasterKey: string
  masterKeyIv: string
  masterKeyTag: string
  masterKeySalt: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  encryptedMasterKey: string
  masterKeyIv: string
  masterKeyTag: string
  masterKeySalt: string
  recoveryEncryptedPayload: string
  recoveryIv: string
  recoveryTag: string
  recoveryKeyHash: string
}

export type RegisterResponse = {
  id: string
  email: string
}
