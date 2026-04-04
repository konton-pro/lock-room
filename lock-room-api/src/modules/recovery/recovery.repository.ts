import { eq, and } from "drizzle-orm";
import { db } from "@database/index";
import { recoveryKeys } from "@schema/recovery-keys.schema";
import { users } from "@schema/users.schema";
import type {
  CreateRecoveryData,
  UpdateRecoveryPayload,
} from "@modules/recovery/recovery.types";

export const recoveryRepository = {
  findByUserCuid: async (userCuid: string) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.cuid, userCuid),
      columns: { id: true },
    });
    if (!user) return null;

    return (
      (await db.query.recoveryKeys.findFirst({
        where: (r, { eq }) => eq(r.userId, user.id),
      })) ?? null
    );
  },

  findByEmailAndHash: async (email: string, hash: string) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
      columns: { id: true, cuid: true },
    });
    if (!user) return null;

    const recovery = await db.query.recoveryKeys.findFirst({
      where: (r, { eq: e }) =>
        and(e(r.userId, user.id), e(r.recoveryKeyHash, hash)),
    });
    if (!recovery) return null;

    return { ...recovery, userCuid: user.cuid };
  },

  upsert: async (data: CreateRecoveryData) => {
    const existing = await db.query.recoveryKeys.findFirst({
      where: (r, { eq }) => eq(r.userId, data.userId),
    });

    if (existing) {
      const [updated] = await db
        .update(recoveryKeys)
        .set({
          encryptedPayload: data.encryptedPayload,
          clientIv: data.clientIv,
          clientTag: data.clientTag,
          serverIv: data.serverIv,
          serverTag: data.serverTag,
          recoveryKeyHash: data.recoveryKeyHash,
          updatedAt: new Date(),
        })
        .where(eq(recoveryKeys.userId, data.userId))
        .returning();
      return updated;
    }

    const [created] = await db.insert(recoveryKeys).values(data).returning();
    return created;
  },

  updatePayload: async (userId: number, data: UpdateRecoveryPayload) => {
    const [updated] = await db
      .update(recoveryKeys)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(recoveryKeys.userId, userId))
      .returning();
    return updated;
  },

  updateUserPassword: async (email: string, hashedPassword: string) => {
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.email, email));
  },
};
