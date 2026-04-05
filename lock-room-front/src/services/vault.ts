import { http } from '@/lib/http'

export type VaultListItem = {
  cuid: string
  encryptedHeader: string
  clientIv: string
  createdAt: string
}

export type VaultItem = VaultListItem & { encryptedBody: string }

export type CreateVaultPayload = {
  encryptedHeader: string
  encryptedBody: string
  clientIv: string
}

export const listVaultItems = (): Promise<VaultListItem[]> =>
  http.get('vault').json<VaultListItem[]>()

export const getVaultItem = (id: string): Promise<VaultItem> =>
  http.get(`vault/${id}`).json<VaultItem>()

export const createVaultItem = (payload: CreateVaultPayload): Promise<{ cuid: string }> =>
  http.post('vault', { json: payload }).json<{ cuid: string }>()

export const deleteVaultItem = (id: string): Promise<void> => http.delete(`vault/${id}`).then(() => undefined)
