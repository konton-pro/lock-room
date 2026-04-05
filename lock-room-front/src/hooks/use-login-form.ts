import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authMutations } from '@/queries/auth'
import { authStore } from '@/stores/auth-store'

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutateAsync, isError, reset: resetMutation } = useMutation({
    ...authMutations.login(),
    onSuccess: (data) => {
      authStore.setToken(data.token)
      navigate({ to: '/dashboard' })
    },
  })

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: ({ value }) => mutateAsync(value),
  })

  return { form, showPassword, setShowPassword, isError, resetMutation }
}
