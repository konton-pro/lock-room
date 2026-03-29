import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { jwtConfig } from "@configs/jwt.config";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";

export const jwtPlugin = new Elysia({ name: "plugin:jwt" }).use(
  jwt({ name: "jwt", secret: jwtConfig.secret }),
);

export const authGuard = new Elysia({ name: "plugin:auth-guard" })
  .use(jwtPlugin)
  .derive({ as: "scoped" }, async ({ headers, jwt }) => {
    const token = headers.authorization?.replace("Bearer ", "");
    if (!token) throw new UnauthorizedException("Missing token");

    const payload = await jwt.verify(token);
    if (!payload) throw new UnauthorizedException("Invalid token");

    return { userId: payload.sub as string };
  });
