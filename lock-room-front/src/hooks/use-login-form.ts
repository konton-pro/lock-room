import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authMutations } from '@/queries/auth'
import { authStore } from '@/stores/auth-store'
import { vaultKeyStore } from '@/stores/vault-key-store'
import { deriveKeyFromPassword } from '@/lib/crypto/keys'
import { decrypt } from '@/lib/crypto/cipher'
import { fromBase64 } from '@/lib/crypto/encoding'
import { validateEmail, validatePassword } from '@/hooks/use-register-form'
import type { LoginResponse } from '@/types/auth'

const decryptMasterKey = async (data: LoginResponse, password: string): Promise<string> => {
  const saltBytes = fromBase64(data.masterKeySalt)
  const wrapKey = await deriveKeyFromPassword(password, saltBytes)
  const masterKeyBytes = await decrypt(
    data.encryptedMasterKey,
    data.masterKeyIv,
    data.masterKeyTag,
    wrapKey,
  )
  return new TextDecoder().decode(masterKeyBytes)
}

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutateAsync, isError, reset: resetMutation } = useMutation(authMutations.login())

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      const data = await mutateAsync({
        email: value.email.toLowerCase(),
        password: value.password,
      })
      authStore.setToken(data.token)
      authStore.setName(data.name)
      const masterKey = await decryptMasterKey(data, value.password)
      vaultKeyStore.setKey(masterKey)
      navigate({ to: '/dashboard' })
    },
    validators: {
      onSubmit: ({ value }) =>
        validateEmail(value.email) || validatePassword(value.password)
          ? 'VALIDATION_FAILED'
          : undefined,
    },
  })

  return { form, showPassword, setShowPassword, isError, resetMutation }
}

export { validateEmail, validatePassword }
