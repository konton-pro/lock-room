import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authMutations } from '@/queries/auth'
import { generateRandomKey, deriveKeyFromPassword } from '@/lib/crypto/keys'
import { encrypt } from '@/lib/crypto/cipher'
import { toBase64 } from '@/lib/crypto/encoding'

const validateName = (value: string) =>
  value.trim().length < 1 ? 'NAME_REQUIRED' : undefined

const validateEmail = (value: string) =>
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'INVALID_EMAIL_FORMAT' : undefined

const validatePassword = (value: string) =>
  value.length < 8 ? 'MIN_8_CHARS_REQUIRED' : undefined

const validateConfirmPassword = (value: string, password: string) =>
  value !== password ? 'PASSWORDS_DO_NOT_MATCH' : undefined

const buildMasterKeyPayload = async (password: string) => {
  const masterKey = generateRandomKey()
  const saltBytes = crypto.getRandomValues(new Uint8Array(16))
  const wrapKey = await deriveKeyFromPassword(password, saltBytes.buffer as ArrayBuffer)
  const { encrypted, iv, tag } = await encrypt(
    new TextEncoder().encode(masterKey).buffer as ArrayBuffer,
    wrapKey,
  )
  return {
    encryptedMasterKey: encrypted,
    masterKeyIv: iv,
    masterKeyTag: tag,
    masterKeySalt: toBase64(saltBytes.buffer as ArrayBuffer),
  }
}

export const useRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutateAsync, isError, reset: resetMutation } = useMutation(authMutations.register())

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      const masterKeyPayload = await buildMasterKeyPayload(value.password)
      await mutateAsync({
        name: value.name,
        email: value.email.toLowerCase(),
        password: value.password,
        ...masterKeyPayload,
      })
      navigate({ to: '/login' })
    },
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
