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
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { cuid: 'k1a2b3c4d5e6f7g8', encryptedHeader: 'CORP_MAINFRAME_ROOT', clientIv: 'AAAAAAAAAAAAAAAA', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
          { cuid: 'k2b3c4d5e6f7g8h9', encryptedHeader: 'SWIFT_TRANS_ENCRYPT', clientIv: 'AAAAAAAAAAAAAAAA', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
          { cuid: 'k3c4d5e6f7g8h9i0', encryptedHeader: 'PERSONAL_SEED_PHRASE', clientIv: 'AAAAAAAAAAAAAAAA', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
          { cuid: 'k4d5e6f7g8h9i0j1', encryptedHeader: 'SATELLITE_UPLINK_04', clientIv: 'AAAAAAAAAAAAAAAA', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
          { cuid: 'k5e6f7g8h9i0j1k2', encryptedHeader: 'LEGACY_DATABASE_KEY', clientIv: 'AAAAAAAAAAAAAAAA', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
          { cuid: 'k6f7g8h9i0j1k2l3', encryptedHeader: 'NEURAL_LINK_AUTH', clientIv: 'AAAAAAAAAAAAAAAA', createdAt: new Date().toISOString() },
        ]),
      800,
    ),
  )

export const getVaultItem = (_id: string): Promise<VaultItem> =>
  new Promise((resolve) => setTimeout(resolve as never, 800))

export const createVaultItem = (_payload: CreateVaultPayload): Promise<{ cuid: string }> =>
  new Promise((resolve) => setTimeout(() => resolve({ cuid: 'newcuid' }), 800))

export const deleteVaultItem = (_id: string): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 800))
