import { Elysia } from "elysia";
import { authGuard } from "@plugins/auth/jwt/jwt.plugin";
import { serverCryptoPlugin } from "@plugins/crypto/server-crypto/server-crypto.plugin";
import { vaultService } from "./vault.service";
import { storeVaultSchema, vaultParamsSchema } from "./vault.schema";
import {
  deleteVaultDocs,
  listVaultDocs,
  retrieveVaultDocs,
  storeVaultDocs,
} from "./vault.docs";

export const vaultRoutes = new Elysia({ prefix: "/vault" })
  .use(authGuard)
  .use(serverCryptoPlugin)
  .post(
    "/",
    async ({ body, userId, serverCrypto, set }) => {
      const item = await vaultService.store(body, userId, serverCrypto);
      set.status = 201;
      return { cuid: item.cuid };
    },
    { ...storeVaultSchema, ...storeVaultDocs },
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
      return vaultService.retrieve(params.id, userId, serverCrypto);
    },
    { ...vaultParamsSchema, ...retrieveVaultDocs },
  )
  .delete(
    "/:id",
    async ({ params, userId, set }) => {
      await vaultService.remove(params.id, userId);
      set.status = 204;
    },
    { ...vaultParamsSchema, ...deleteVaultDocs },
  );
