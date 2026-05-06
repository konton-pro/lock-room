import { and, eq, gt } from "drizzle-orm";
import { db } from "@database/index";
import { users } from "@schema/users.schema";
import { userSessions } from "@schema/user-sessions.schema";
import type { MasterKeyData, SessionInput } from "@modules/auth/auth.types";

export const authRepository = {
  findByEmail: async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ?? null;
  },

  findByCuid: async (cuid: string) => {
    const [user] = await db.select().from(users).where(eq(users.cuid, cuid));
    return user ?? null;
  },

  findById: async (id: number) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  },

  create: async (
    name: string,
    email: string,
    hashedPassword: string,
    masterKeyData: MasterKeyData,
  ) => {
    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, ...masterKeyData })
      .returning();
    return user;
  },

  createSession: async (session: SessionInput) => {
    const user = await authRepository.findByCuid(session.userCuid);
    if (!user) return null;

    const [created] = await db
      .insert(userSessions)
      .values({
        userId: user.id,
        sessionIdHash: session.sessionIdHash,
        ipSubnet: session.ipSubnet,
        userAgentHash: session.userAgentHash,
        expiresAt: session.expiresAt,
      })
      .returning();

    return created ?? null;
  },

  deleteSessionsByUserCuid: async (userCuid: string) => {
    const user = await authRepository.findByCuid(userCuid);
    if (!user) return;

    await db.delete(userSessions).where(eq(userSessions.userId, user.id));
  },

  findActiveSessionByHash: async (sessionIdHash: string, now: Date) => {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.sessionIdHash, sessionIdHash),
          gt(userSessions.expiresAt, now),
        ),
      );

    return session ?? null;
  },

  touchSessionByHash: async (sessionIdHash: string, expiresAt: Date) => {
    await db
      .update(userSessions)
      .set({ expiresAt, updatedAt: new Date() })
      .where(eq(userSessions.sessionIdHash, sessionIdHash));
  },

  deleteSessionByHash: async (sessionIdHash: string) => {
    await db
      .delete(userSessions)
      .where(eq(userSessions.sessionIdHash, sessionIdHash));
  },
};
