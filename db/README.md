# Database

Raw SQL with `@vercel/postgres` (no ORM). The `sql` template tag is re-exported from `src/lib/db.ts`.

## Migrations

Plain SQL files in `db/migrations/` named `NNNN_name.sql` (e.g. `0001_subscriptions.sql`).

Migrations are applied in lexicographic order. Each runs once and is tracked in a `_migrations` table.

### Adding a migration

1. Create a new file: `db/migrations/NNNN_description.sql` (increment the number).
2. Write idempotent SQL where possible (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`).
3. Run locally:
   ```bash
   npm run db:migrate
   ```
4. Re-running is safe — already-applied migrations are skipped.

### Running migrations

```bash
npm run db:migrate
```

Requires `POSTGRES_URL` in `.env.local` (or as an environment variable in Vercel).
