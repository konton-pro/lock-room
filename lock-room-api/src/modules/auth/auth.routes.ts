import { Elysia } from "elysia";
import { sessionGuard } from "@plugins/auth/session/session.plugin";
import { sessionHelpers } from "@plugins/auth/session/session.helpers";
import { serverCryptoPlugin } from "@plugins/crypto/server-crypto/server-crypto.plugin";
import { rateLimitAuthPlugin } from "@plugins/infra/rate-limit/rate-limit-auth.plugin";
import { authService } from "@modules/auth/auth.service";
import { authRepository } from "@modules/auth/auth.repository";
import { loginSchema, registerSchema } from "@modules/auth/auth.schema";
import { loginDocs, logoutDocs, registerDocs } from "@modules/auth/auth.docs";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export const authRoutes = new Elysia({ prefix: "/auth" })
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
    async ({ body, request, set }) => {
      const data = loginSchema.body.parse(body);
      const { userCuid, name, masterKeyData } = await authService.login(
        data.email,
        data.password,
      );

      await authRepository.deleteSessionsByUserCuid(userCuid);

      const sessionId = sessionHelpers.generateSessionId();
      const sessionIdHash = sessionHelpers.hashSessionId(sessionId);
      const expiresAt = sessionHelpers.getExpiresAt();
      const requestIpSubnet = sessionHelpers.resolveSubnet(request);
      const requestUserAgentHash = sessionHelpers.hashUserAgent(
        request.headers.get("user-agent"),
      );

      await authRepository.createSession({
        userCuid,
        sessionIdHash,
        ipSubnet: requestIpSubnet,
        userAgentHash: requestUserAgentHash,
        expiresAt,
      });

      set.headers["set-cookie"] = sessionHelpers.buildSessionCookie(
        sessionId,
        expiresAt,
      );

      return { name, ...masterKeyData };
    },
    loginDocs,
  )
  .use(sessionGuard)
  .post(
    "/logout",
    async ({ sessionIdHash, set }) => {
      await authRepository.deleteSessionByHash(sessionIdHash);
      set.headers["set-cookie"] = sessionHelpers.buildClearSessionCookie();
      set.status = HTTP_STATUS.NO_CONTENT;
    },
    logoutDocs,
  );
