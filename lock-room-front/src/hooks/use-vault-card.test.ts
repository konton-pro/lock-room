import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { createVaultBodyQueryOptions, DECRYPT_FAILED, resolveVaultBodyForCopy } from './use-vault-card'
import { getVaultItem, type VaultItem, type VaultListItem } from '@/services/vault'
import { decryptVaultField } from '@/lib/crypto/vault-crypto'
import { vaultKeyStore } from '@/stores/vault-key-store'

vi.mock('@/services/vault', () => ({
  getVaultItem: vi.fn(),
}))

vi.mock('@/lib/crypto/vault-crypto', () => ({
  decryptVaultField: vi.fn(),
}))

vi.mock('@/stores/vault-key-store', () => ({
  vaultKeyStore: {
    getKey: vi.fn(),
  },
}))

const getVaultItemMock = vi.mocked(getVaultItem)
const decryptVaultFieldMock = vi.mocked(decryptVaultField)
const getVaultKeyMock = vi.mocked(vaultKeyStore.getKey)

const listItem: VaultListItem = {
  cuid: 'vault-entry-1234',
  encryptedHeader: 'encrypted-title',
  clientIv: 'client-iv',
  createdAt: '2026-04-05T00:00:00.000Z',
}

const fullItem: VaultItem = {
  ...listItem,
  encryptedBody: 'encrypted-body',
}

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

describe('useVaultCard copy helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getVaultKeyMock.mockReturnValue('master-key')
    getVaultItemMock.mockResolvedValue(fullItem)
    decryptVaultFieldMock.mockResolvedValue('body-secret')
  })

  it('fetches and decrypts the body when copy runs on a cold cache', async () => {
    const queryClient = createQueryClient()
    const bodyQueryOptions = createVaultBodyQueryOptions(listItem)

    const value = await resolveVaultBodyForCopy({
      body: null,
      queryClient,
      bodyQueryOptions,
    })

    expect(value).toBe('body-secret')
    expect(getVaultItemMock).toHaveBeenCalledTimes(1)
    expect(getVaultItemMock).toHaveBeenCalledWith(listItem.cuid)
    expect(decryptVaultFieldMock).toHaveBeenCalledWith(
      fullItem.encryptedBody,
      fullItem.clientIv,
      'master-key',
    )
  })

  it('reuses the already loaded body instead of fetching again', async () => {
    const queryClient = createQueryClient()
    const bodyQueryOptions = createVaultBodyQueryOptions(listItem)

    const value = await resolveVaultBodyForCopy({
      body: 'body-secret',
      queryClient,
      bodyQueryOptions,
    })

    expect(value).toBe('body-secret')
    expect(getVaultItemMock).not.toHaveBeenCalled()
    expect(decryptVaultFieldMock).not.toHaveBeenCalled()
  })

  it('returns a decrypt failure marker without fetching when the key is missing', async () => {
    getVaultKeyMock.mockReturnValue(null)

    const value = await createVaultBodyQueryOptions(listItem).queryFn()

    expect(value).toBe(DECRYPT_FAILED)
    expect(getVaultItemMock).not.toHaveBeenCalled()
    expect(decryptVaultFieldMock).not.toHaveBeenCalled()
  })

  it('returns a decrypt failure marker when decryption rejects', async () => {
    decryptVaultFieldMock.mockRejectedValue(new Error('decrypt failed'))

    const value = await createVaultBodyQueryOptions(listItem).queryFn()

    expect(value).toBe(DECRYPT_FAILED)
    expect(getVaultItemMock).toHaveBeenCalledTimes(1)
  })
})
