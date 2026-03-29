import { Elysia } from "elysia";
import { errorMappers } from "@plugins/core/error-handler/error-handler.mapper";
import { serverConfig } from "@configs/server.config";

export const errorHandlerPlugin = new Elysia({
  name: "plugin:error-handler",
}).onError({ as: "global" }, ({ error, set }) => {
  const mapper = errorMappers.find(({ match }) => match(error))!;
  const { status, body } = mapper.map(error);

  set.status = status;

  return {
    ...body,
    ...(!serverConfig.isProduction && {
      stack: error instanceof Error ? error.stack : undefined,
    }),
  };
});
