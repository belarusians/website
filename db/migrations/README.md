# Database Migrations

Naming convention: `NNNN_name.sql` (e.g. `0001_subscriptions.sql`).

Migrations are applied in lexicographic order by filename. Each migration runs once; applied migrations are tracked in a `_migrations` table.

Run all pending migrations:

```bash
npm run db:migrate
```
