import { Elysia } from "elysia";
import { sanitize } from "@plugins/infra/xss/xss.sanitize";

export const xssPlugin = new Elysia({ name: "plugin:xss" }).onTransform(
  (ctx) => {
    ctx.body = sanitize(ctx.body);
  },
);
