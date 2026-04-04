const SENSITIVE_FIELDS = new Set([
  "password",
  "newPassword",
  "token",
  "secret",
  "recoveryKeyHash",
  "encryptedPayload",
  "encryptedHeader",
  "encryptedBody",
  "newEncryptedPayload",
  "clientIv",
  "iv",
  "tag",
  "newIv",
  "newTag",
]);

const redactSensitiveFields = (value: unknown): unknown => {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(redactSensitiveFields);

  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => [
      key,
      SENSITIVE_FIELDS.has(key)
        ? "[redacted]"
        : redactSensitiveFields(fieldValue),
    ]),
  );
};

const isJsonRequest = (request: Request) =>
  (request.headers.get("content-type") ?? "").includes(
    "application/json",
  );

export const sanitizeHeaders = (
  headers: Headers,
): Record<string, string> => {
  const sanitized: Record<string, string> = {};

  headers.forEach((value, key) => {
    sanitized[key] = key === "authorization" ? "[redacted]" : value;
  });

  return sanitized;
};

export const parseBody = (request: Request): Promise<unknown> =>
  isJsonRequest(request)
    ? request
        .clone()
        .json()
        .then(redactSensitiveFields)
        .catch(() => null)
    : Promise.resolve(null);
