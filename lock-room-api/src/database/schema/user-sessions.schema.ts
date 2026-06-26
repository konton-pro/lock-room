import { createId } from "@paralleldrive/cuid2";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "@schema/users.schema";

export const userSessions = pgTable(
  "user_sessions",
  {
    id: serial("id").primaryKey(),
    cuid: varchar("cuid", { length: 36 })
      .notNull()
      .unique()
      .$defaultFn(() => createId()),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    sessionIdHash: varchar("session_id_hash", { length: 64 }).notNull().unique(),
    ipSubnet: varchar("ip_subnet", { length: 64 }).notNull(),
    userAgentHash: varchar("user_agent_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("user_sessions_user_id_idx").on(table.userId),
    index("user_sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));
