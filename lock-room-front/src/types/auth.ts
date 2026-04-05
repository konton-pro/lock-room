export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
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
}

export type RegisterResponse = {
  id: string
  email: string
}
