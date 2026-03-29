import type { HttpStatusEntry } from "@plugins/core/error-handler/http-status.constants";

export class HttpError extends Error {
  readonly statusCode: HttpStatusEntry;

  constructor(
    statusCode: HttpStatusEntry,
    message: string,
  ) {
    super(message);

    this.statusCode = statusCode;

    this.name = "HttpError";
  }
}
