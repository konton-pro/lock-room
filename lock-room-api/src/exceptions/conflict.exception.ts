import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export class ConflictException extends HttpError {
  constructor(message = "Conflict") {
    super(HTTP_STATUS.CONFLICT, message);
  }
}
