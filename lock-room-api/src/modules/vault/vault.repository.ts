import { eq, and } from "drizzle-orm";
import { db } from "@database/index";
import { vault } from "@schema/vault.schema";
import type { CreateVaultData } from "./vault.types";

export const vaultRepository = {
  create: async (data: CreateVaultData) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.cuid, data.userCuid),
      columns: { id: true },
    });

    if (!user) return null;

    const { userCuid: _, ...fields } = data;

    const [item] = await db
      .insert(vault)
      .values({ ...fields, userId: user.id })
      .returning();
    
      return item;
  },

  findByCuid: async (cuid: string) => {
    return (
      (await db.query.vault.findFirst({
        where: (v, { eq }) => eq(v.cuid, cuid),
        with: { user: { columns: { cuid: true } } },
      })) ?? null
    );
  },

  findAllByUserCuid: async (userCuid: string) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.cuid, userCuid),
      columns: { id: true },
    });
    if (!user) return [];

    return db.query.vault.findMany({
      where: (v, { eq }) => eq(v.userId, user.id),
    });
  },

  removeByCuid: async (cuid: string, userCuid: string) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.cuid, userCuid),
      columns: { id: true },
    });
    
    if (!user) return;

    await db
      .delete(vault)
      .where(and(eq(vault.cuid, cuid), eq(vault.userId, user.id)));
  },
};
