import type { ZodError } from "zod";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";
import { UnprocessableEntityException } from "@exceptions/unprocessable-entity.exception";

export type ValidationErrorItem = {
  campo: string;
  mensagem: string;
};

export type ErrorToHttpResult = {
  status: number;
  body: {
    message: string;
    errors: ValidationErrorItem[];
  };
};

export const mapZodErrorToHttp = (error: ZodError): ErrorToHttpResult => {
  return {
    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    body: {
      ...new UnprocessableEntityException("Erro de validação").toResponse(),
      errors: error.issues.map((issue): ValidationErrorItem => {
        const path = issue.path;

        const campo =
          path.length > 0
            ? String(path[path.length - 1] ?? path.join("."))
            : "";

        return {
          campo,
          mensagem: issue.message,
        };
      }),
    },
  };
};
