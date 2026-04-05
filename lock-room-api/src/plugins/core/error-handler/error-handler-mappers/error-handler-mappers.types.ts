export type ErrorContext = {
  error: unknown;
  code:
    | number
    | "INTERNAL_SERVER_ERROR"
    | "INVALID_COOKIE_SIGNATURE"
    | "INVALID_FILE_TYPE"
    | "NOT_FOUND"
    | "PARSE"
    | "UNKNOWN"
    | "VALIDATION";
  request: Request;
};

export type ErrorMapper = {
  match: (ctx: ErrorContext) => boolean;
  map: (ctx: ErrorContext) => { status: number; body: object };
};
