import type { QueryClient } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import ky from 'ky'
import { env } from '@/env'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { authStore } from '@/stores/auth-store'
import { vaultKeyStore } from '@/stores/vault-key-store'
import type { RecoveryStatusResponse } from '@/types/recovery'

export const clearClientSessionState = (): void => {
  authStore.clearSessionState()
  vaultKeyStore.clearKey()

  if (typeof window !== 'undefined') {
    getContext().queryClient.clear()
  }
}

export const redirectToLogin = (): void => {
  if (typeof window === 'undefined') return
  if (window.location.pathname === '/login') return
  window.location.replace('/login')
}

export const handleUnauthorizedSession = (): void => {
  clearClientSessionState()
  redirectToLogin()
}

export const isUnauthorizedError = (error: unknown): error is HTTPError =>
  error instanceof HTTPError && error.response.status === 401

export const hasActiveSession = async (queryClient: QueryClient): Promise<boolean> => {
  const baseUrl = env.VITE_API_URL ?? 'http://localhost:3001'
  const sessionCheckQuery = {
    queryKey: ['recovery', 'status'] as const,
    queryFn: () =>
      ky.get('recovery/status', { prefixUrl: baseUrl, credentials: 'include' })
        .json<RecoveryStatusResponse>(),
  }

  try {
    await queryClient.ensureQueryData(sessionCheckQuery)
    return true
  } catch (error) {
    if (isUnauthorizedError(error)) {
      clearClientSessionState()
      return false
    }

    return false
  }
}
