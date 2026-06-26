import { Elysia } from "elysia";
import { rateLimit, DefaultContext } from "elysia-rate-limit";
import { serverConfig } from "@configs/server.config";
import { rateLimitHelpers } from "@plugins/infra/rate-limit/rate-limit.helpers";

export const rateLimitPlugin = new Elysia({ name: "plugin:rate-limit" }).use(
  rateLimit({
    duration: 60_000,
    max: serverConfig.maxRequestsPerMinute,
    context: new DefaultContext(),
    countFailedRequest: true,
    generator: (req) => rateLimitHelpers.generateKey(req),
  }),
);
