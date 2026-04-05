import { z } from "zod";

export const storeRecoverySchema = {
  body: z.object({
    encryptedPayload: z.string(),
    iv: z.string(),
    tag: z.string(),
    recoveryKeyHash: z.string().length(64),
  }),
};

export const verifyRecoverySchema = {
  body: z.object({
    email: z.email(),
    recoveryKeyHash: z.string().length(64),
  }),
};

export const resetRecoverySchema = {
  body: z.object({
    email: z.email(),
    recoveryKeyHash: z.string().length(64),
    newPassword: z.string().min(8),
    newEncryptedPayload: z.string(),
    newIv: z.string(),
    newTag: z.string(),
    newEncryptedMasterKey: z.string(),
    newMasterKeyIv: z.string(),
    newMasterKeyTag: z.string(),
    newMasterKeySalt: z.string(),
  }),
};
