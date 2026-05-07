import { sessionConfig } from "@configs/session.config";

export const getSessionExpiresAt = (baseDate: Date = new Date()): Date =>
  new Date(baseDate.getTime() + sessionConfig.ttlMs);
