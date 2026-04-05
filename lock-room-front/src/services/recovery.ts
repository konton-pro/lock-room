import { http } from '@/lib/http'
import type {
  StoreRecoveryPayload,
  StoreRecoveryResponse,
  RecoveryStatusResponse,
  VerifyRecoveryPayload,
  VerifyRecoveryResponse,
  ResetRecoveryPayload,
} from '@/types/recovery'

export const storeRecoveryKey = (payload: StoreRecoveryPayload): Promise<StoreRecoveryResponse> =>
  http.post('recovery', { json: payload }).json<StoreRecoveryResponse>()

export const getRecoveryStatus = (): Promise<RecoveryStatusResponse> =>
  http.get('recovery/status').json<RecoveryStatusResponse>()

export const verifyRecoveryKey = (payload: VerifyRecoveryPayload): Promise<VerifyRecoveryResponse> =>
  http.post('recovery/verify', { json: payload }).json<VerifyRecoveryResponse>()

export const resetWithRecoveryKey = (payload: ResetRecoveryPayload): Promise<void> =>
  http.post('recovery/reset', { json: payload }).then(() => undefined)
