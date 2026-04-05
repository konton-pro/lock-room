import { Elysia } from "elysia";
import { serverConfig } from "@configs/server.config";
import { errorHandlerPlugin } from "@plugins/core/error-handler/error-handler.plugin";
import { corsPlugin } from "@plugins/infra/cors/cors.plugin";
import { rateLimitPlugin } from "@plugins/infra/rate-limit/rate-limit.plugin";
import { xssPlugin } from "@plugins/infra/xss/xss.plugin";
import { loggerPlugin } from "@plugins/infra/logger/logger.plugin";
import { swaggerPlugin } from "@plugins/docs/swagger/swagger.plugin";
import { modulesRoutes } from "./modules/modules.routes";

export const app = new Elysia()
  .use(errorHandlerPlugin)
  .use(corsPlugin)
  .use(rateLimitPlugin)
  .use(xssPlugin)
  .use(loggerPlugin)
  .use(serverConfig.isProduction ? new Elysia() : swaggerPlugin)
  .use(modulesRoutes);

if (import.meta.main) {
  app.listen({ port: serverConfig.port, hostname: serverConfig.hostname });
  console.log(
    `Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  );
}
