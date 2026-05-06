import {
  buildClearSessionCookie,
  buildSessionCookie,
  extractSessionId,
} from "@plugins/auth/session/session.cookie";
import {
  generateSessionId,
  hashSessionId,
  hashSha256,
  hashUserAgent,
} from "@plugins/auth/session/session.hash";
import {
  extractIp,
  resolveSubnet,
  toSubnet,
} from "@plugins/auth/session/session.network";
import { getSessionExpiresAt } from "@plugins/auth/session/session.time";

export const sessionHelpers = {
  extractSessionId,
  generateSessionId,
  hash: hashSha256,
  hashSessionId,
  hashUserAgent,
  extractIp,
  toSubnet,
  resolveSubnet,
  getExpiresAt: getSessionExpiresAt,
  buildSessionCookie,
  buildClearSessionCookie,
};
