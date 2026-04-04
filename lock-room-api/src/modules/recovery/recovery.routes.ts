import { Elysia } from "elysia";
import { authGuard } from "@plugins/auth/jwt/jwt.plugin";
import { serverCryptoPlugin } from "@plugins/crypto/server-crypto/server-crypto.plugin";
import { rateLimitAuthPlugin } from "@plugins/infra/rate-limit/rate-limit-auth.plugin";
import { recoveryService } from "@modules/recovery/recovery.service";
import {
  storeRecoverySchema,
  verifyRecoverySchema,
  resetRecoverySchema,
} from "@modules/recovery/recovery.schema";
import {
  storeRecoveryDocs,
  statusRecoveryDocs,
  verifyRecoveryDocs,
  resetRecoveryDocs,
} from "@modules/recovery/recovery.docs";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

const authenticatedRoutes = new Elysia()
  .use(authGuard)
  .use(serverCryptoPlugin)
  .post(
    "/",
    async ({ body, userId, serverCrypto, set }) => {
      const data = storeRecoverySchema.body.parse(body);

      const recovery = await recoveryService.store(data, userId, serverCrypto);

      set.status = HTTP_STATUS.CREATED;
      return { cuid: recovery.cuid };
    },
    storeRecoveryDocs,
  )
  .get(
    "/status",
    async ({ userId }) => {
      return recoveryService.status(userId);
    },
    statusRecoveryDocs,
  );

const publicRoutes = new Elysia()
  .use(rateLimitAuthPlugin)
  .use(serverCryptoPlugin)
  .post(
    "/verify",
    async ({ body, serverCrypto }) => {
      const data = verifyRecoverySchema.body.parse(body);

      return recoveryService.verify(
        data.email,
        data.recoveryKeyHash,
        serverCrypto,
      );
    },
    verifyRecoveryDocs,
  )
  .post(
    "/reset",
    async ({ body, serverCrypto, set }) => {
      const data = resetRecoverySchema.body.parse(body);

      await recoveryService.reset(data, serverCrypto);

      set.status = HTTP_STATUS.NO_CONTENT;
    },
    resetRecoveryDocs,
  );

export const recoveryRoutes = new Elysia({ prefix: "/recovery" })
  .use(authenticatedRoutes)
  .use(publicRoutes);
