import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authMutations } from '@/queries/auth'

const validateName = (value: string) => value.trim().length >= 1

const validateEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const validatePassword = (value: string) => value.length >= 8

export const useRegisterForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ name: false, email: false, password: false })
  const navigate = useNavigate()

  const { mutate: registerUser, isPending, isError, reset } = useMutation({
    ...authMutations.register(),
    onSuccess: () => navigate({ to: '/login' }),
  })

  const errors = {
    name: touched.name && !validateName(name) ? 'NAME_REQUIRED' : null,
    email: touched.email && !validateEmail(email) ? 'INVALID_EMAIL_FORMAT' : null,
    password: touched.password && !validatePassword(password) ? 'MIN_8_CHARS_REQUIRED' : null,
  }

  const checks = {
    name: validateName(name),
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
    setTouched({ name: true, email: true, password: true })
    if (!validateName(name) || !validateEmail(email) || !validatePassword(password)) return
    registerUser({ name, email, password })
  }

  const isReady = validateName(name) && validateEmail(email) && validatePassword(password)

  return {
    name,
    email,
    password,
    showPassword,
    setShowPassword,
    isPending,
    isError,
    isReady,
    errors,
    checks,
    onNameChange: handleFieldChange(setName, 'name'),
    onEmailChange: handleFieldChange(setEmail, 'email'),
    onPasswordChange: handleFieldChange(setPassword, 'password'),
    handleSubmit,
  }
}
