import { createId } from "@paralleldrive/cuid2";
import { index, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vault } from "@schema/vault.schema";

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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export const usersRelations = relations(users, ({ many }) => ({
  vault: many(vault),
}));
