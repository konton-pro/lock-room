import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { rateLimitHelpers } from "@plugins/infra/rate-limit/rate-limit.helpers";

export const rateLimitAuthPlugin = new Elysia({
  name: "plugin:rate-limit-auth",
}).use(
  rateLimit({
    duration: 60_000,
    max: 5,
    generator: (req) => rateLimitHelpers.generateKey(req),
  }),
);
