import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { clearClientSessionState, isUnauthorizedError } from '@/lib/session'
import { authMutations } from '@/queries/auth'

export const useLogout = () => {
  const navigate = useNavigate()
  const { mutateAsync } = useMutation(authMutations.logout())

  return async () => {
    try {
      await mutateAsync()
    } catch (error) {
      if (!isUnauthorizedError(error)) return
    }

    clearClientSessionState()
    navigate({ to: '/login' })
  }
}
