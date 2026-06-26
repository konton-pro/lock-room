import ky from 'ky'
import { env } from '@/env'
import { handleUnauthorizedSession } from '@/lib/session'

const BASE_URL = env.VITE_API_URL ?? 'http://localhost:3001'
const UNAUTHORIZED_STATUS = 401

type RequestContext = {
  protectedRoute?: boolean
  suppressUnauthorizedRedirect?: boolean
}

type ProtectedRouteOptions = {
  suppressUnauthorizedRedirect?: boolean
}

const getRequestContext = (context: unknown): RequestContext =>
  (context ?? {}) as RequestContext

const shouldHandleUnauthorized = (
  status: number,
  context: RequestContext,
  isClient: boolean,
): boolean =>
  status === UNAUTHORIZED_STATUS
  && context.protectedRoute === true
  && context.suppressUnauthorizedRedirect !== true
  && isClient

export const protectedRouteOptions = (options: ProtectedRouteOptions = {}) => ({
  context: {
    protectedRoute: true,
    suppressUnauthorizedRedirect: options.suppressUnauthorizedRedirect ?? false,
  } as RequestContext,
})

export const http = ky.create({
  prefixUrl: BASE_URL,
  credentials: 'include',
  hooks: {
    afterResponse: [
      (_request, options, response) => {
        const context = getRequestContext(options.context)
        const isClient = typeof window !== 'undefined'

        if (shouldHandleUnauthorized(response.status, context, isClient)) {
          handleUnauthorizedSession()
        }
      },
    ],
  },
})
