import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authMutations } from '@/queries/auth'

const validateEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const validatePassword = (value: string) => value.length >= 8

export const useRegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const navigate = useNavigate()

  const { mutate: registerUser, isPending, isError, reset } = useMutation({
    ...authMutations.register(),
    onSuccess: () => navigate({ to: '/login' }),
  })

  const errors = {
    email: touched.email && !validateEmail(email) ? 'INVALID_EMAIL_FORMAT' : null,
    password: touched.password && !validatePassword(password) ? 'MIN_8_CHARS_REQUIRED' : null,
  }

  const checks = {
    email: email.length > 0 && validateEmail(email),
    password: validatePassword(password),
  }

  const handleFieldChange =
    (setter: (v: string) => void, field: keyof typeof touched) => (value: string) => {
      if (isError) reset()
      setter(value)
      setTouched((prev) => ({ ...prev, [field]: true }))
    }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!validateEmail(email) || !validatePassword(password)) return
    registerUser({ email, password })
  }

  const isReady = validateEmail(email) && validatePassword(password)

  return {
    email,
    password,
    showPassword,
    setShowPassword,
    isPending,
    isError,
    isReady,
    errors,
    checks,
    onEmailChange: handleFieldChange(setEmail, 'email'),
    onPasswordChange: handleFieldChange(setPassword, 'password'),
    handleSubmit,
  }
}
