import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authMutations } from '@/queries/auth'

const validateName = (value: string) =>
  value.trim().length < 1 ? 'NAME_REQUIRED' : undefined

const validateEmail = (value: string) =>
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'INVALID_EMAIL_FORMAT' : undefined

const validatePassword = (value: string) =>
  value.length < 8 ? 'MIN_8_CHARS_REQUIRED' : undefined

const validateConfirmPassword = (value: string, password: string) =>
  value !== password ? 'PASSWORDS_DO_NOT_MATCH' : undefined

export const useRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutateAsync, isError, reset: resetMutation } = useMutation({
    ...authMutations.register(),
    onSuccess: () => navigate({ to: '/login' }),
  })

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: ({ value }) => mutateAsync({ name: value.name, email: value.email.toLowerCase(), password: value.password }),
    validators: {
      onSubmit: ({ value }) =>
        validateName(value.name) ||
        validateEmail(value.email) ||
        validatePassword(value.password) ||
        validateConfirmPassword(value.confirmPassword, value.password)
          ? 'VALIDATION_FAILED'
          : undefined,
    },
  })

  return { form, showPassword, setShowPassword, isError, resetMutation }
}

export { validateName, validateEmail, validatePassword, validateConfirmPassword }
