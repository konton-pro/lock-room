import { sessionConfig } from "@configs/session.config";
import { parse, serialize } from "cookie";
import { COOKIE_EXPIRATION } from "@plugins/auth/session/session.constants";

export const extractSessionId = (
  cookieHeader?: string | null,
): string | null => {
  if (!cookieHeader) return null;

  const parsedCookies = parse(cookieHeader);
  const rawValue = parsedCookies[sessionConfig.cookieName];
  if (!rawValue) return null;

  return rawValue;
};

export const buildSessionCookie = (
  sessionId: string,
  expiresAt: Date,
): string => {
  const maxAgeSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  return serialize(sessionConfig.cookieName, sessionId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: Math.max(0, maxAgeSeconds),
    expires: expiresAt,
    secure: sessionConfig.secureCookie,
  });
};

export const buildClearSessionCookie = (): string => {
  return serialize(sessionConfig.cookieName, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(COOKIE_EXPIRATION),
    secure: sessionConfig.secureCookie,
  });
};
