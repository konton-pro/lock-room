import { eq } from "drizzle-orm";
import { db } from "@database/index";
import { users } from "@schema/users.schema";

export const authRepository = {
  findByEmail: async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ?? null;
  },

  create: async (email: string, hashedPassword: string) => {
    const [user] = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning();
    return user;
  },
};
