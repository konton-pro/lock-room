import { Elysia } from "elysia";
import { jwtPlugin } from "@plugins/auth/jwt/jwt.plugin";
import { rateLimitAuthPlugin } from "@plugins/infra/rate-limit/rate-limit-auth.plugin";
import { authService } from "@modules/auth/auth.service";
import { loginSchema, registerSchema } from "@modules/auth/auth.schema";
import { loginDocs, registerDocs } from "@modules/auth/auth.docs";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
  .use(rateLimitAuthPlugin)
  .post(
    "/register",
    async ({ body, set }) => {
      const data = registerSchema.body.parse(body);
      const user = await authService.register(data.name, data.email, data.password, {
        encryptedMasterKey: data.encryptedMasterKey,
        masterKeyIv: data.masterKeyIv,
        masterKeyTag: data.masterKeyTag,
        masterKeySalt: data.masterKeySalt,
      });
      set.status = 201;
      return { id: user.cuid, email: user.email };
    },
    registerDocs,
  )
  .post(
    "/login",
    async ({ body, jwt }) => {
      const data = loginSchema.body.parse(body);
      const { jwtPayload, masterKeyData } = await authService.login(
        data.email,
        data.password,
      );
      const token = await jwt.sign(jwtPayload);
      return { token, ...masterKeyData };
    },
    loginDocs,
  );
