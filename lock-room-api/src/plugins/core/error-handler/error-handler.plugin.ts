import { Elysia } from "elysia";
import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export const errorHandlerPlugin = new Elysia({
  name: "plugin:error-handler",
}).onError(({ error, set }) => {
  if (error instanceof HttpError) {
    set.status = error.statusCode;

    return { message: error.message };
  }

  set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return { message: "Internal server error" };
});
