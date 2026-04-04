import { createId } from "@paralleldrive/cuid2";
import {
  customType,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "@schema/users.schema";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const recoveryKeys = pgTable("recovery_keys", {
  id: serial("id").primaryKey(),
  cuid: varchar("cuid", { length: 36 })
    .notNull()
    .unique()
    .$defaultFn(() => createId()),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  encryptedPayload: bytea("encrypted_payload").notNull(),
  clientIv: bytea("client_iv").notNull(),
  clientTag: bytea("client_tag").notNull(),
  serverIv: bytea("server_iv").notNull(),
  serverTag: bytea("server_tag").notNull(),
  recoveryKeyHash: varchar("recovery_key_hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const recoveryKeysRelations = relations(recoveryKeys, ({ one }) => ({
  user: one(users, {
    fields: [recoveryKeys.userId],
    references: [users.id],
  }),
}));
