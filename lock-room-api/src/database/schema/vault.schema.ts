import { createId } from "@paralleldrive/cuid2";
import {
  customType,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const vault = pgTable("vault", {
  id: serial("id").primaryKey(),
  cuid: varchar("cuid", { length: 36 })
    .notNull()
    .unique()
    .$defaultFn(() => createId()),
  userId: varchar("user_id", { length: 36 }).notNull(),
  encryptedHeader: bytea("encrypted_header").notNull(),
  encryptedBody: bytea("encrypted_body").notNull(),
  clientIv: bytea("client_iv").notNull(),
  serverHeaderIv: bytea("server_header_iv").notNull(),
  serverHeaderTag: bytea("server_header_tag").notNull(),
  serverBodyIv: bytea("server_body_iv").notNull(),
  serverBodyTag: bytea("server_body_tag").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
