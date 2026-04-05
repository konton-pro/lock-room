import { z } from "zod";

export const registerSchema = {
  body: z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    encryptedMasterKey: z.string(),
    masterKeyIv: z.string(),
    masterKeyTag: z.string(),
    masterKeySalt: z.string(),
    recoveryEncryptedPayload: z.string(),
    recoveryIv: z.string(),
    recoveryTag: z.string(),
    recoveryKeyHash: z.string(),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
};
