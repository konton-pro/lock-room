import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "@database/connection";

export const db = drizzle(pool);
