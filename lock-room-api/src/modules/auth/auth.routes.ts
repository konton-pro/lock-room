import { Elysia } from "elysia";
import { jwtPlugin } from "@plugins/auth/jwt/jwt.plugin";
import { serverCryptoPlugin } from "@plugins/crypto/server-crypto/server-crypto.plugin";
import { rateLimitAuthPlugin } from "@plugins/infra/rate-limit/rate-limit-auth.plugin";
import { authService } from "@modules/auth/auth.service";
import { loginSchema, registerSchema } from "@modules/auth/auth.schema";
import { loginDocs, registerDocs } from "@modules/auth/auth.docs";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
  .use(serverCryptoPlugin)
  .use(rateLimitAuthPlugin)
  .post(
    "/register",
    async ({ body, serverCrypto, set }) => {
      const data = registerSchema.body.parse(body);
      const user = await authService.register(
        data.name,
        data.email,
        data.password,
        {
          encryptedMasterKey: data.encryptedMasterKey,
          masterKeyIv: data.masterKeyIv,
          masterKeyTag: data.masterKeyTag,
          masterKeySalt: data.masterKeySalt,
        },
        {
          encryptedPayload: data.recoveryEncryptedPayload,
          iv: data.recoveryIv,
          tag: data.recoveryTag,
          recoveryKeyHash: data.recoveryKeyHash,
        },
        serverCrypto,
      );
      set.status = 201;
      return { id: user.cuid, email: user.email };
    },
    registerDocs,
  )
  .post(
    "/login",
    async ({ body, jwt }) => {
      const data = loginSchema.body.parse(body);
      const { name, jwtPayload, masterKeyData } = await authService.login(
        data.email,
        data.password,
      );
      const token = await jwt.sign(jwtPayload);
      return { token, name, ...masterKeyData };
    },
    loginDocs,
  );
