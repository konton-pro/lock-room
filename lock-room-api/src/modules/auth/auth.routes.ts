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
      const user = await authService.register(body.email, body.password);
      set.status = 201;
      return { id: user.cuid, email: user.email };
    },
    { ...registerSchema, ...registerDocs },
  )
  .post(
    "/login",
    async ({ body, jwt }) => {
      const payload = await authService.login(body.email, body.password);

      const token = await jwt.sign(payload);

      return { token };
    },
    { ...loginSchema, ...loginDocs },
  );
