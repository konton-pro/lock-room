import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { authMutations } from '@/queries/auth'
import { generateRandomKey, deriveKeyFromPassword } from '@/lib/crypto/keys'
import { encrypt } from '@/lib/crypto/cipher'
import { toBase64 } from '@/lib/crypto/encoding'
import { generateRecoveryKey, hashRecoveryKey, encryptMasterKeyWithRecoveryKey } from '@/lib/crypto/recovery-crypto'

export const registerSchema = z.object({
  name: z.string().min(1, 'NAME_REQUIRED'),
  email: z.string().email('INVALID_EMAIL_FORMAT'),
  password: z.string().min(8, 'MIN_8_CHARS_REQUIRED'),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'PASSWORDS_DO_NOT_MATCH', path: ['confirmPassword'] })
  }
})

const buildRegistrationPayload = async (password: string) => {
  const masterKey = generateRandomKey()
  const saltBytes = crypto.getRandomValues(new Uint8Array(16))
  const wrapKey = await deriveKeyFromPassword(password, saltBytes.buffer as ArrayBuffer)
  const { encrypted, iv, tag } = await encrypt(
    new TextEncoder().encode(masterKey).buffer as ArrayBuffer,
    wrapKey,
  )

  const recoveryKey = generateRecoveryKey()
  const [recoveryKeyHash, recoveryPayload] = await Promise.all([
    hashRecoveryKey(recoveryKey),
    encryptMasterKeyWithRecoveryKey(masterKey, recoveryKey),
  ])

  return {
    recoveryKey,
    masterKeyPayload: {
      encryptedMasterKey: encrypted,
      masterKeyIv: iv,
      masterKeyTag: tag,
      masterKeySalt: toBase64(saltBytes.buffer as ArrayBuffer),
    },
    recoveryPayload: {
      recoveryEncryptedPayload: recoveryPayload.encrypted,
      recoveryIv: recoveryPayload.iv,
      recoveryTag: recoveryPayload.tag,
      recoveryKeyHash,
    },
  }
}

export const useRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null)
  const navigate = useNavigate()

  const { mutateAsync, isError, reset: resetMutation } = useMutation(authMutations.register())

  const form = useForm({
    validators: { onSubmit: registerSchema },
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      const { recoveryKey: key, masterKeyPayload, recoveryPayload } = await buildRegistrationPayload(value.password)
      await mutateAsync({
        name: value.name,
        email: value.email.toLowerCase(),
        password: value.password,
        ...masterKeyPayload,
        ...recoveryPayload,
      })
      setRecoveryKey(key)
    },
  })

  const onRecoveryAcknowledged = () => navigate({ to: '/login' })

  return { form, showPassword, setShowPassword, isError, resetMutation, recoveryKey, onRecoveryAcknowledged }
}
