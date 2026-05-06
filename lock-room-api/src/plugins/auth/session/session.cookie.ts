import { sessionConfig } from "@configs/session.config";
import { COOKIE_EXPIRATION } from "@plugins/auth/session/session.constants";

const splitCookie = (cookieHeader: string) =>
  cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);

const buildCookieFlags = (expiresAt: Date, maxAgeSeconds: number): string => {
  const flags = [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    `Expires=${expiresAt.toUTCString()}`,
  ];

  if (sessionConfig.secureCookie) flags.push("Secure");

  return flags.join("; ");
};

export const extractSessionId = (
  cookieHeader?: string | null,
): string | null => {
  if (!cookieHeader) return null;

  const sessionCookie = splitCookie(cookieHeader).find((entry) =>
    entry.startsWith(`${sessionConfig.cookieName}=`),
  );

  if (!sessionCookie) return null;

  const rawValue = sessionCookie.slice(sessionConfig.cookieName.length + 1);
  if (!rawValue) return null;

  return decodeURIComponent(rawValue);
};

export const buildSessionCookie = (
  sessionId: string,
  expiresAt: Date,
): string => {
  const maxAgeSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

  return `${sessionConfig.cookieName}=${encodeURIComponent(sessionId)}; ${buildCookieFlags(
    expiresAt,
    Math.max(0, maxAgeSeconds),
  )}`;
};

export const buildClearSessionCookie = (): string => {
  const flags = [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
    `Expires=${COOKIE_EXPIRATION}`,
  ];
  if (sessionConfig.secureCookie) flags.push("Secure");

  return `${sessionConfig.cookieName}=; ${flags.join("; ")}`;
};
