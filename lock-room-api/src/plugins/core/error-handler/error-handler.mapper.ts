import { ZodError } from "zod";
import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";
import { mapZodErrorToHttp } from "@plugins/core/error-handler/zod-error.mapper";

type ErrorMapper = {
  match: (error: unknown) => boolean;
  map: (error: unknown) => { status: number; body: object };
};

export const errorMappers: ErrorMapper[] = [
  {
    match: (error) => error instanceof ZodError,
    map: (error) => mapZodErrorToHttp(error as ZodError),
  },
  {
    match: (error) => error instanceof HttpError,
    map: (error) => {
      const err = error as HttpError;

      return { status: err.statusCode, body: err.toResponse() };
    },
  },
  {
    match: (error) => true,
    map: () => ({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: { message: "Internal server error" },
    }),
  },
];
