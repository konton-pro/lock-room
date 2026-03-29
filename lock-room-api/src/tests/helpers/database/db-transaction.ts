import { afterEach, beforeEach } from "bun:test";
import type { PoolClient } from "pg";
import { pool } from "@database/connection";
import { db } from "@database/index";

export function dbTransaction() {
  let client: PoolClient;

  beforeEach(async () => {
    client = await pool.connect();
    await client.query("BEGIN");
    (db.session as any).client = client;
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
    (db.session as any).client = pool;
  });
}

export default dbTransaction;
