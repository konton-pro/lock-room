import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { jwtConfig } from "@configs/jwt.config";

export const jwtPlugin = new Elysia({ name: "plugin:jwt" }).use(
  jwt({ name: "jwt", secret: jwtConfig.secret }),
);
