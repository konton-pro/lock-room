import { z } from "zod";

export const storeVaultSchema = {
  body: z.object({
    encryptedHeader: z.string(),
    encryptedBody: z.string(),
    clientIv: z.string(),
  }),
};

export const vaultParamsSchema = {
  params: z.object({
    id: z.string().cuid2(),
  }),
};
