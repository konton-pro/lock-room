// @vitest-environment jsdom

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DELETE_FAILED,
  useDeleteVaultEntry,
  type DeleteVaultEntryRequest,
} from './use-delete-vault-entry'

const deleteMutationMock = vi.fn()

vi.mock('@/queries/vault', () => ({
  vaultMutations: {
    delete: () => ({
      mutationFn: (id: string) => deleteMutationMock(id),
    }),
  },
}))

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

const pendingEntry: DeleteVaultEntryRequest = {
  id: 'vault-entry-1234',
  formattedId: 'VT-1234',
  title: 'ACHE-JA-SUPERADMIN',
}

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

describe('useDeleteVaultEntry', () => {
  beforeEach(() => {
    deleteMutationMock.mockReset()
  })

  it('invalidates the list, clears entry caches, and closes the selected modal after success', async () => {
    const queryClient = createQueryClient()
    const onCloseSelectedCard = vi.fn()

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries')

    deleteMutationMock.mockResolvedValue(undefined)

    const { result } = renderHook(
      () =>
        useDeleteVaultEntry({
          selectedCardId: 'vault-entry-1234',
          onCloseSelectedCard,
        }),
      { wrapper: createWrapper(queryClient) },
    )

    act(() => {
      result.current.requestDelete(pendingEntry)
    })

    await act(async () => {
      await result.current.confirmDelete()
    })

    await waitFor(() => {
      expect(result.current.pendingEntry).toBeNull()
    })

    expect(deleteMutationMock).toHaveBeenCalledWith('vault-entry-1234')
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['vault', 'list'] })
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['vault', 'detail', 'vault-entry-1234'],
      exact: true,
    })
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['vault', 'body', 'vault-entry-1234'],
      exact: true,
    })
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['vault', 'title', 'vault-entry-1234'],
      exact: true,
    })
    expect(onCloseSelectedCard).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
  })

  it('keeps the confirmation open and exposes DELETE_FAILED after a failed deletion', async () => {
    const queryClient = createQueryClient()

    deleteMutationMock.mockRejectedValue(new Error('delete failed'))

    const { result } = renderHook(
      () =>
        useDeleteVaultEntry({
          selectedCardId: 'vault-entry-1234',
          onCloseSelectedCard: vi.fn(),
        }),
      { wrapper: createWrapper(queryClient) },
    )

    act(() => {
      result.current.requestDelete(pendingEntry)
    })

    await act(async () => {
      await result.current.confirmDelete()
    })

    await waitFor(() => {
      expect(result.current.error).toBe(DELETE_FAILED)
    })

    expect(result.current.pendingEntry).toEqual(pendingEntry)
    expect(result.current.isDeleting).toBe(false)
  })
})
