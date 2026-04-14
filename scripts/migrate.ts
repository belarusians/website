import 'dotenv/config';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { sql } from '@vercel/postgres';
import { orderMigrationFiles } from './migrate-utils';

const MIGRATIONS_DIR = path.resolve(__dirname, '../db/migrations');

async function ensureMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await sql`SELECT name FROM _migrations ORDER BY name`;
  return new Set(result.rows.map((r) => r.name as string));
}

async function main() {
  console.log('Running migrations...');

  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const entries = await readdir(MIGRATIONS_DIR);
  const pending = orderMigrationFiles(entries).filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  for (const file of pending) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const content = await readFile(filePath, 'utf-8');

    console.log(`Applying ${file}...`);
    await sql.query('BEGIN');
    try {
      await sql.query(content);
      await sql`INSERT INTO _migrations (name) VALUES (${file})`;
      await sql.query('COMMIT');
    } catch (err) {
      await sql.query('ROLLBACK');
      throw err;
    }
    console.log(`Applied ${file}.`);
  }

  console.log(`Done. Applied ${pending.length} migration(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
