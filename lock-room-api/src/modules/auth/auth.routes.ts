import { Elysia } from "elysia";
import { jwtPlugin } from "@plugins/auth/jwt/jwt.plugin";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { loginDocs, registerDocs } from "./auth.docs";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
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
