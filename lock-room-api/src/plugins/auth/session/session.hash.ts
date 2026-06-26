import { createHash } from "node:crypto";
import { UNKNOWN_VALUE } from "@plugins/auth/session/session.constants";

export const hashSha256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

export const hashSessionId = (sessionId: string): string =>
  hashSha256(sessionId);

export const hashUserAgent = (userAgent?: string | null): string =>
  hashSha256((userAgent ?? UNKNOWN_VALUE).trim());

export const generateSessionId = (): string =>
  crypto.randomUUID().replaceAll("-", "");
