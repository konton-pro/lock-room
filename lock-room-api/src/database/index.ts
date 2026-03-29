import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "@database/connection";
import * as usersSchema from "@schema/users.schema";
import * as vaultSchema from "@schema/vault.schema";

export const db = drizzle(pool, {
  schema: { ...usersSchema, ...vaultSchema },
});
