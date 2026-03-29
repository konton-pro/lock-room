import { filterXSS } from "xss";

export const sanitize = (value: unknown): unknown => {
  if (typeof value === "string") return filterXSS(value);

  if (Array.isArray(value)) return value.map(sanitize);

  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        sanitize(v),
      ]),
    );

  return value;
};
