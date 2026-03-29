import { t } from "elysia";

export const storeVaultSchema = {
  body: t.Object({
    encryptedHeader: t.String(),
    encryptedBody: t.String(),
    clientIv: t.String(),
  }),
};

export const vaultParamsSchema = {
  params: t.Object({
    id: t.String({ format: "uuid" }),
  }),
};
