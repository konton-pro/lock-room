import { db } from '@database/index';
import { afterEach, beforeEach, afterAll } from 'bun:test';

const pool = (db as { _client?: { end: () => Promise<void> } })._client;

export function dbTransaction() {
  beforeEach(async () => {
    await db.execute('BEGIN');
  });

  afterEach(async () => {
    await db.execute('ROLLBACK');
  });

  afterAll(async () => {
    if (pool && typeof pool.end === 'function') {
      await pool.end();
    }
  });
}

export default dbTransaction;