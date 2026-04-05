import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authStore } from '@/stores/auth-store'
import { vaultKeyStore } from '@/stores/vault-key-store'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    authStore.clearToken()
    vaultKeyStore.clearKey()
    queryClient.clear()
    navigate({ to: '/' })
  }
}
