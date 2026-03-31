import {
  listVaultItems,
  getVaultItem,
  createVaultItem,
  deleteVaultItem,
} from '@/services/vault'
import type { CreateVaultPayload } from '@/services/vault'

export const vaultQueries = {
  list: () => ({
    queryKey: ['vault', 'list'] as const,
    queryFn: listVaultItems,
  }),
  detail: (id: string) => ({
    queryKey: ['vault', 'detail', id] as const,
    queryFn: () => getVaultItem(id),
  }),
}

export const vaultMutations = {
  create: () => ({
    mutationFn: (payload: CreateVaultPayload) => createVaultItem(payload),
  }),
  delete: () => ({
    mutationFn: (id: string) => deleteVaultItem(id),
  }),
}
