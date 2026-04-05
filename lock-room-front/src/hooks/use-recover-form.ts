import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { recoveryMutations } from '@/queries/recovery'
import { deriveKeyFromPassword } from '@/lib/crypto/keys'
import { encrypt } from '@/lib/crypto/cipher'
import { toBase64 } from '@/lib/crypto/encoding'
import {
  hashRecoveryKey,
  encryptMasterKeyWithRecoveryKey,
  decryptMasterKeyWithRecoveryKey,
  normalizeRecoveryKey,
} from '@/lib/crypto/recovery-crypto'

type Step = 'verify' | 'reset'

const verifySchema = z.object({
  email: z.string().email('INVALID_EMAIL_FORMAT'),
  recoveryKey: z.string().refine(
    (v) => normalizeRecoveryKey(v).length === 64,
    'INVALID_RECOVERY_KEY_FORMAT',
  ),
})

const resetSchema = z.object({
  newPassword: z.string().min(8, 'MIN_8_CHARS_REQUIRED'),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'PASSWORDS_DO_NOT_MATCH', path: ['confirmPassword'] })
  }
})

export const useRecoverForm = () => {
  const [step, setStep] = useState<Step>('verify')
  const [storedEmail, setStoredEmail] = useState('')
  const [storedRecoveryKey, setStoredRecoveryKey] = useState('')
  const [masterKey, setMasterKey] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutateAsync: verifyKey, isError: verifyError, reset: resetVerify } = useMutation(recoveryMutations.verify())
  const { mutateAsync: resetAccount, isError: resetError, reset: resetReset } = useMutation(recoveryMutations.reset())

  const verifyForm = useForm({
    validators: { onSubmit: verifySchema },
    defaultValues: { email: '', recoveryKey: '' },
    onSubmit: async ({ value }) => {
      const normalized = normalizeRecoveryKey(value.recoveryKey)
      const recoveryKeyHash = await hashRecoveryKey(normalized)
      const response = await verifyKey({ email: value.email.toLowerCase(), recoveryKeyHash })
      const decrypted = await decryptMasterKeyWithRecoveryKey(
        response.encryptedPayload,
        response.iv,
        response.tag,
        normalized,
      )
      setStoredEmail(value.email.toLowerCase())
      setStoredRecoveryKey(normalized)
      setMasterKey(decrypted)
      setStep('reset')
    },
  })

  const resetForm = useForm({
    validators: { onSubmit: resetSchema },
    defaultValues: { newPassword: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      if (!masterKey) return

      const saltBytes = crypto.getRandomValues(new Uint8Array(16))
      const wrapKey = await deriveKeyFromPassword(value.newPassword, saltBytes.buffer as ArrayBuffer)
      const { encrypted, iv, tag } = await encrypt(
        new TextEncoder().encode(masterKey).buffer as ArrayBuffer,
        wrapKey,
      )

      const [recoveryKeyHash, newRecoveryPayload] = await Promise.all([
        hashRecoveryKey(storedRecoveryKey),
        encryptMasterKeyWithRecoveryKey(masterKey, storedRecoveryKey),
      ])

      await resetAccount({
        email: storedEmail,
        recoveryKeyHash,
        newPassword: value.newPassword,
        newEncryptedPayload: newRecoveryPayload.encrypted,
        newIv: newRecoveryPayload.iv,
        newTag: newRecoveryPayload.tag,
        newEncryptedMasterKey: encrypted,
        newMasterKeyIv: iv,
        newMasterKeyTag: tag,
        newMasterKeySalt: toBase64(saltBytes.buffer as ArrayBuffer),
      })

      navigate({ to: '/login' })
    },
  })

  return { step, verifyForm, resetForm, verifyError, resetError, resetVerify, resetReset, showPassword, setShowPassword }
}
