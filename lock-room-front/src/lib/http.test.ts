import { beforeEach, describe, expect, it, vi } from 'vitest'

const handleUnauthorizedSession = vi.fn()

vi.mock('@/lib/session', () => ({
  handleUnauthorizedSession,
}))

import { http, protectedRouteOptions } from '@/lib/http'

describe('http client session behavior', () => {
  beforeEach(() => {
    handleUnauthorizedSession.mockReset()
  })

  it('sends requests with credentials include by default', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const request = input as Request
      expect(request.credentials).toBe('include')
      return new Response('{}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    })

    await http.get('health', { fetch: fetchMock }).json<Record<string, unknown>>()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('handles 401 only for protected routes', async () => {
    const fetch401 = vi.fn(async () => new Response('', { status: 401 }))

    await expect(
      http.get('vault', { ...protectedRouteOptions(), fetch: fetch401 }).text(),
    ).rejects.toBeTruthy()
    expect(handleUnauthorizedSession).toHaveBeenCalledTimes(1)

    handleUnauthorizedSession.mockReset()

    await expect(
      http.get('auth/login', { fetch: fetch401 }).text(),
    ).rejects.toBeTruthy()
    expect(handleUnauthorizedSession).not.toHaveBeenCalled()
  })
})
