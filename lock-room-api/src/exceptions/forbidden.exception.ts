import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export class ForbiddenException extends HttpError {
  constructor(message = "Forbidden") {
    super(HTTP_STATUS.FORBIDDEN, message);
  }
}
