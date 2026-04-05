import { Elysia } from "elysia";
import { rateLimit, DefaultContext } from "elysia-rate-limit";
import { serverConfig } from "@configs/server.config";
import { rateLimitHelpers } from "@plugins/infra/rate-limit/rate-limit.helpers";
import { jwtPlugin } from "@plugins/auth/jwt/jwt.plugin";

export const rateLimitAuthPlugin = new Elysia({
  name: "plugin:rate-limit-auth",
})
  .use(jwtPlugin)
  .use(
    rateLimit({
      duration: 60_000,
      max: serverConfig.maxAuthRequestsPerMinute,
      scoping: "scoped",
      context: new DefaultContext(),
      generator: async (req, server, { jwt }) => await rateLimitHelpers.generateKey(req, jwt as any),
    }),
  );
