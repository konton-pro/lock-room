import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authMutations } from '@/queries/auth'

export const useLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutate: login, isPending, isError, reset } = useMutation({
    ...authMutations.login(),
    onSuccess: () => navigate({ to: '/dashboard' }),
  })

  const handleFieldChange = (setter: (v: string) => void) => (value: string) => {
    if (isError) reset()
    setter(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    login({ email, password })
  }

  const isReady = email.trim().length > 0 && password.trim().length > 0

  return {
    email,
    password,
    showPassword,
    setShowPassword,
    isPending,
    isError,
    isReady,
    onEmailChange: handleFieldChange(setEmail),
    onPasswordChange: handleFieldChange(setPassword),
    handleSubmit,
  }
}
