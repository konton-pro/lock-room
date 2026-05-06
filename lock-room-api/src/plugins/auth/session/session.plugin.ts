import { Elysia } from "elysia";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { authRepository } from "@modules/auth/auth.repository";
import { sessionHelpers } from "@plugins/auth/session/session.helpers";

const MISSING_SESSION = "Missing session";
const INVALID_SESSION = "Invalid session";

export const sessionGuard = new Elysia({ name: "plugin:session-guard" })
  .derive({ as: "scoped" }, async ({ request, set }) => {
    const cookieHeader = request.headers.get("cookie");
    const sessionId = sessionHelpers.extractSessionId(cookieHeader);

    if (!sessionId) throw new UnauthorizedException(MISSING_SESSION);

    const sessionIdHash = sessionHelpers.hashSessionId(sessionId);
    const session = await authRepository.findActiveSessionByHash(
      sessionIdHash,
      new Date(),
    );

    if (!session) throw new UnauthorizedException(INVALID_SESSION);

    const requestIpSubnet = sessionHelpers.resolveSubnet(request);
    const requestUserAgentHash = sessionHelpers.hashUserAgent(
      request.headers.get("user-agent"),
    );

    const subnetChanged = session.ipSubnet !== requestIpSubnet;
    const userAgentChanged = session.userAgentHash !== requestUserAgentHash;

    if (subnetChanged || userAgentChanged) {
      await authRepository.deleteSessionByHash(sessionIdHash);
      throw new UnauthorizedException(INVALID_SESSION);
    }

    const user = await authRepository.findById(session.userId);

    if (!user) {
      await authRepository.deleteSessionByHash(sessionIdHash);
      throw new UnauthorizedException(INVALID_SESSION);
    }

    const expiresAt = sessionHelpers.getExpiresAt();
    await authRepository.touchSessionByHash(sessionIdHash, expiresAt);
    set.headers["set-cookie"] = sessionHelpers.buildSessionCookie(
      sessionId,
      expiresAt,
    );

    return {
      userId: user.cuid,
      sessionId,
      sessionIdHash,
    };
  });
