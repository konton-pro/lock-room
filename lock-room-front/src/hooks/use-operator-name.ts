import { useSyncExternalStore } from 'react'
import { authStore } from '@/stores/auth-store'

const getSnapshot = () => (authStore.getName() ?? 'UNKNOWN').toUpperCase()
const getServerSnapshot = () => 'UNKNOWN'

export const useOperatorName = (): string =>
  useSyncExternalStore(authStore.subscribe, getSnapshot, getServerSnapshot)
