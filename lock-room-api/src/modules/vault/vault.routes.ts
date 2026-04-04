import { Elysia } from "elysia";
import { authGuard } from "@plugins/auth/jwt/jwt.plugin";
import { serverCryptoPlugin } from "@plugins/crypto/server-crypto/server-crypto.plugin";
import { vaultService } from "@modules/vault/vault.service";
import {
  storeVaultSchema,
  vaultParamsSchema,
} from "@modules/vault/vault.schema";
import {
  deleteVaultDocs,
  listVaultDocs,
  retrieveVaultDocs,
  storeVaultDocs,
} from "@modules/vault/vault.docs";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export const vaultRoutes = new Elysia({ prefix: "/vault" })
  .use(authGuard)
  .use(serverCryptoPlugin)
  .post(
    "/",
    async ({ body, userId, serverCrypto, set }) => {
      const data = storeVaultSchema.body.parse(body);

      const item = await vaultService.store(data, userId, serverCrypto);

      set.status = HTTP_STATUS.CREATED;
      return { cuid: item.cuid };
    },
    storeVaultDocs,
  )
  .get(
    "/",
    async ({ userId, serverCrypto }) => {
      return vaultService.list(userId, serverCrypto);
    },
    listVaultDocs,
  )
  .get(
    "/:id",
    async ({ params, userId, serverCrypto }) => {
      const { id } = vaultParamsSchema.params.parse(params);

      return vaultService.retrieve(id, userId, serverCrypto);
    },
    retrieveVaultDocs,
  )
  .delete(
    "/:id",
    async ({ params, userId, set }) => {
      const { id } = vaultParamsSchema.params.parse(params);

      await vaultService.remove(id, userId);

      set.status = HTTP_STATUS.NO_CONTENT;
    },
    deleteVaultDocs,
  );
