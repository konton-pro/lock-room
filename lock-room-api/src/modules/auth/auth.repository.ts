import { eq } from "drizzle-orm";
import { db } from "@database/index";
import { users } from "@schema/users.schema";
import type { MasterKeyData } from "@modules/auth/auth.types";

export const authRepository = {
  findByEmail: async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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
};
