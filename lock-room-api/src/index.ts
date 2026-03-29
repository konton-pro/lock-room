import { Elysia } from "elysia";
import { serverConfig } from "@configs/server.config";
import { errorHandlerPlugin } from "@plugins/core/error-handler/error-handler.plugin";
import { corsPlugin } from "@plugins/infra/cors/cors.plugin";
import { rateLimitPlugin } from "@plugins/infra/rate-limit/rate-limit.plugin";
import { xssPlugin } from "@plugins/infra/xss/xss.plugin";
import { swaggerPlugin } from "@plugins/docs/swagger/swagger.plugin";
import { modulesRoutes } from "./modules/modules.routes";

const app = new Elysia()
  .use(errorHandlerPlugin)
  .use(corsPlugin)
  .use(rateLimitPlugin)
  .use(xssPlugin)
  .use(swaggerPlugin)
  .use(modulesRoutes)
  .listen(serverConfig.port);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
