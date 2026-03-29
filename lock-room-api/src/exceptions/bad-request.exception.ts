import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export class BadRequestException extends HttpError {
  constructor(message = "Bad request") {
    super(HTTP_STATUS.BAD_REQUEST, message);
  }
}
