import { sql } from '@vercel/postgres';

export function getDb() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL env variable should be set');
  }
  return sql;
}

export { sql };
