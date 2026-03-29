import { HttpError } from "@plugins/core/error-handler/http-error";
import { HTTP_STATUS } from "@plugins/core/error-handler/http-status.constants";

export class NotFoundException extends HttpError {
  constructor(message = "Not found") {
    super(HTTP_STATUS.NOT_FOUND, message);
  }
}
