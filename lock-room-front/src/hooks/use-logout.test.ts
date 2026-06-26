import { beforeEach, describe, expect, it, vi } from 'vitest'

const navigate = vi.fn()
const mutateAsync = vi.fn()
const clearClientSessionState = vi.fn()
const isUnauthorizedError = vi.fn(() => false)

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutateAsync }),
}))

vi.mock('@/queries/auth', () => ({
  authMutations: {
    logout: () => ({ mutationFn: vi.fn() }),
  },
}))

vi.mock('@/lib/session', () => ({
  clearClientSessionState,
  isUnauthorizedError,
}))

import { useLogout } from '@/hooks/use-logout'

describe('useLogout', () => {
  beforeEach(() => {
    navigate.mockReset()
    mutateAsync.mockReset()
    clearClientSessionState.mockReset()
    isUnauthorizedError.mockReset()
  })

  it('clears session and redirects when logout succeeds', async () => {
    mutateAsync.mockResolvedValue(undefined)

    const logout = useLogout()
    await logout()

    expect(clearClientSessionState).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith({ to: '/login' })
  })

  it('does not redirect on non-401 errors', async () => {
    const error = new Error('network')
    mutateAsync.mockRejectedValue(error)
    isUnauthorizedError.mockReturnValue(false)

    const logout = useLogout()
    await logout()

    expect(clearClientSessionState).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('clears session and redirects on 401 errors', async () => {
    const error = new Error('unauthorized')
    mutateAsync.mockRejectedValue(error)
    isUnauthorizedError.mockReturnValue(true)

    const logout = useLogout()
    await logout()

    expect(clearClientSessionState).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith({ to: '/login' })
  })
})
