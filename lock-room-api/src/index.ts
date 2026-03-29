import { Elysia } from "elysia";
import { corsPlugin } from "@/plugins/infra/cors/cors.plugin";
import { rateLimitPlugin } from "@/plugins/infra/rate-limit/rate-limit.plugin";
import { xssPlugin } from "@/plugins/infra/xss/xss.plugin";
import { serverConfig } from "@configs/server.config";

const app = new Elysia()
  .use(corsPlugin)
  .use(rateLimitPlugin)
  .use(xssPlugin)
  .listen(serverConfig.port);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
