import { Elysia } from "elysia";
import { logger } from "@plugins/infra/logger/logger";
import { sanitizeHeaders, parseBody } from "@plugins/infra/logger/logger.helpers";

export const loggerPlugin = new Elysia({ name: "plugin:logger" })
  .decorate("logger", logger)
  .onRequest(async ({ request }) => {
    logger.info(
      {
        method: request.method,
        url: request.url,
        headers: sanitizeHeaders(request.headers),
        body: await parseBody(request),
      },
      "incoming request",
    );
  })
  .onAfterHandle(({ request, set }) => {
    logger.info(
      { method: request.method, url: request.url, status: set.status },
      "request handled",
    );
  })
  .onError(({ request, error, set }) => {
    const status = typeof set.status === "number" ? set.status : 500;

    if (status >= 500) {
      logger.error(
        { method: request.method, url: request.url, status, err: error },
        "server error",
      );
      return;
    }

    logger.warn(
      { method: request.method, url: request.url, status, message: error instanceof Error ? error.message : String(error) },
      "client error",
    );
  });
