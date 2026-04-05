import { ZodError } from "zod";
import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";
import { mapZodErrorToHttp } from "@plugins/core/error-handler/zod-error.mapper";
import type {
  ErrorMapper,
} from "@plugins/core/error-handler/error-handler-mappers/error-handler-mappers.types";

export const errorMappers: ErrorMapper[] = [
  {
    match: ({ code }) => code === "NOT_FOUND",
    map: ({ request }) => {
      const method = request.method;
      const url = new URL(request.url).pathname;

      return {
        status: HTTP_STATUS.NOT_FOUND,
        body: { message: `${method} - ${url} not found` },
      };
    },
  },
  {
    match: ({ error }) => error instanceof ZodError,
    map: ({ error }) => mapZodErrorToHttp(error as ZodError),
  },
  {
    match: ({ error }) => error instanceof HttpError,
    map: ({ error }) => {
      const err = error as HttpError;

      return { status: err.statusCode, body: err.toResponse() };
    },
  },
  {
    match: () => true,
    map: () => ({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: { message: "Internal server error" },
    }),
  },
];
