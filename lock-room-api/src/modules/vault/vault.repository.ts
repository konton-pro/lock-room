import { eq, and } from "drizzle-orm";
import { db } from "@database/index";
import { vault } from "@schema/vault.schema";
import type { CreateVaultData } from "./vault.types";

export const vaultRepository = {
  create: async (data: CreateVaultData) => {
    const [item] = await db.insert(vault).values(data).returning();
    return item;
  },

  findByCuid: async (cuid: string) => {
    const [item] = await db
      .select()
      .from(vault)
      .where(eq(vault.cuid, cuid));
    return item ?? null;
  },

  findAllByUserId: async (userId: string) => {
    return db.select().from(vault).where(eq(vault.userId, userId));
  },

  removeByCuid: async (cuid: string, userId: string) => {
    await db
      .delete(vault)
      .where(and(eq(vault.cuid, cuid), eq(vault.userId, userId)));
  },
};
