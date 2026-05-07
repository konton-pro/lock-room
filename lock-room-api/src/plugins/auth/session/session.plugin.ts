import { Elysia } from "elysia";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { authRepository } from "@modules/auth/auth.repository";
import {
  buildClearSessionCookie,
  buildSessionCookie,
  extractSessionId,
} from "@plugins/auth/session/session.cookie";
import { hashSessionId, hashUserAgent } from "@plugins/auth/session/session.hash";
import { resolveSubnet } from "@plugins/auth/session/session.network";
import { getSessionExpiresAt } from "@plugins/auth/session/session.time";

const MISSING_SESSION = "Missing session";
const INVALID_SESSION = "Invalid session";

export const sessionGuard = new Elysia({ name: "plugin:session-guard" })
  .derive({ as: "scoped" }, async ({ request, set }) => {
    const cookieHeader = request.headers.get("cookie");
    const sessionId = extractSessionId(cookieHeader);

    if (!sessionId) {
      set.headers["set-cookie"] = buildClearSessionCookie();
      throw new UnauthorizedException(MISSING_SESSION);
    }

    const sessionIdHash = hashSessionId(sessionId);
    const session = await authRepository.findActiveSessionByHash(
      sessionIdHash,
      new Date(),
    );

    if (!session) {
      set.headers["set-cookie"] = buildClearSessionCookie();
      throw new UnauthorizedException(INVALID_SESSION);
    }

    const requestIpSubnet = resolveSubnet(request);
    const requestUserAgentHash = hashUserAgent(
      request.headers.get("user-agent"),
    );

    const subnetChanged = session.ipSubnet !== requestIpSubnet;
    const userAgentChanged = session.userAgentHash !== requestUserAgentHash;

    if (subnetChanged || userAgentChanged) {
      await authRepository.deleteSessionByHash(sessionIdHash);
      set.headers["set-cookie"] = buildClearSessionCookie();
      throw new UnauthorizedException(INVALID_SESSION);
    }

    const user = await authRepository.findById(session.userId);

    if (!user) {
      await authRepository.deleteSessionByHash(sessionIdHash);
      set.headers["set-cookie"] = buildClearSessionCookie();
      throw new UnauthorizedException(INVALID_SESSION);
    }

    const expiresAt = getSessionExpiresAt();
    await authRepository.touchSessionByHash(sessionIdHash, expiresAt);
    set.headers["set-cookie"] = buildSessionCookie(sessionId, expiresAt);

    return {
      userId: user.cuid,
      sessionId,
      sessionIdHash,
    };
  });
