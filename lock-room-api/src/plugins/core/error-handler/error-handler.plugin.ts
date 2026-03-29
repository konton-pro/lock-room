import { Elysia } from "elysia";
import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";
import { serverConfig } from "@configs/server.config";

export const errorHandlerPlugin = new Elysia({
  name: "plugin:error-handler",
}).onError({ as: "global" }, ({ error, set }) => {
  if (error instanceof HttpError) {
    set.status = error.statusCode;

    return {
      message: error.message,
      ...(!serverConfig.isProduction && { stack: error.stack }),
    };
  }

  set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return {
    message: "Internal server error",
    ...(!serverConfig.isProduction && { stack: error instanceof Error ? error.stack : undefined }),
  };
});
