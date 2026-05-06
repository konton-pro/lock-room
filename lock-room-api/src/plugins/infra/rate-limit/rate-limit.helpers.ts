import { extractSessionId } from "@plugins/auth/session/session.cookie";
import { hashSessionId } from "@plugins/auth/session/session.hash";
import { extractIp } from "@plugins/auth/session/session.network";

export const rateLimitHelpers = {
  extractSessionId(req: Request): string | null {
    const cookieHeader = req.headers.get("cookie");
    return extractSessionId(cookieHeader);
  },

  extractIp(req: Request): string {
    return extractIp(req);
  },

  generateKey(req: Request): string {
    const sessionId = this.extractSessionId(req);
    if (sessionId) return `session:${hashSessionId(sessionId)}`;

    return `ip:${this.extractIp(req)}`;
  },
};
