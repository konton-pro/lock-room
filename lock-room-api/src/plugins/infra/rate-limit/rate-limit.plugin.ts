import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";

export const rateLimitPlugin = new Elysia({ name: "plugin:rate-limit" }).use(
  rateLimit({
    duration: 60_000,
    max: 100,
    generator: (req) =>
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown",
  }),
);
