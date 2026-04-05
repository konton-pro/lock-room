import { createId } from "@paralleldrive/cuid2";
import {
  index,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vault } from "@schema/vault.schema";
import { recoveryKeys } from "@schema/recovery-keys.schema";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    cuid: varchar("cuid", { length: 36 })
      .notNull()
      .unique()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    encryptedMasterKey: text("encrypted_master_key"),
    masterKeyIv: varchar("master_key_iv", { length: 64 }),
    masterKeyTag: varchar("master_key_tag", { length: 64 }),
    masterKeySalt: varchar("master_key_salt", { length: 64 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export const usersRelations = relations(users, ({ many, one }) => ({
  vault: many(vault),
  recoveryKey: one(recoveryKeys),
}));
