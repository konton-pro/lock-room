import ky from 'ky'
import { authStore } from '@/stores/auth-store'
import { env } from '@/env'

const BASE_URL = env.VITE_API_URL ?? 'http://localhost:3001'

export const http = ky.create({
  prefixUrl: BASE_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = authStore.getToken()
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
  },
})
