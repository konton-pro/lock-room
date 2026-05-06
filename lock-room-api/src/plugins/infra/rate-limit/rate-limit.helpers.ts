import { sessionHelpers } from "@plugins/auth/session/session.helpers";

export const rateLimitHelpers = {
  extractSessionId(req: Request): string | null {
    const cookieHeader = req.headers.get("cookie");
    return sessionHelpers.extractSessionId(cookieHeader);
  },

  extractIp(req: Request): string {
    return sessionHelpers.extractIp(req);
  },

  generateKey(req: Request): string {
    const sessionId = this.extractSessionId(req);
    if (sessionId) return `session:${sessionHelpers.hashSessionId(sessionId)}`;

    return `ip:${this.extractIp(req)}`;
  },
};
