import {
  storeRecoveryKey,
  getRecoveryStatus,
  verifyRecoveryKey,
  resetWithRecoveryKey,
} from '@/services/recovery'
import type { StoreRecoveryPayload, VerifyRecoveryPayload, ResetRecoveryPayload } from '@/types/recovery'

export const recoveryQueries = {
  status: () => ({
    queryKey: ['recovery', 'status'] as const,
    queryFn: getRecoveryStatus,
  }),
}

export const recoveryMutations = {
  store: () => ({
    mutationFn: (payload: StoreRecoveryPayload) => storeRecoveryKey(payload),
  }),
  verify: () => ({
    mutationFn: (payload: VerifyRecoveryPayload) => verifyRecoveryKey(payload),
  }),
  reset: () => ({
    mutationFn: (payload: ResetRecoveryPayload) => resetWithRecoveryKey(payload),
  }),
}
