import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export class UnprocessableEntityException extends HttpError {
  constructor(message = "Unprocessable entity") {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message);
  }
}
