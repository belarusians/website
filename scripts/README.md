# Scripts

CLI scripts run via `tsx`. Environment variables are loaded from `.env.local` via `dotenv`.

## Available scripts

### `migrate.ts`

Applies pending database migrations from `db/migrations/`.

```bash
npm run db:migrate
```

See `db/README.md` for details on adding and running migrations.

### `sync-stripe-donors.ts`

Backfills the `subscriptions` table by enrolling existing monthly Stripe donors into the `financial_report` newsletter. Eligibility: active subscription with 2 or more paid invoices.

```bash
# Preview what would be enrolled (no DB writes)
npm run sync:stripe-donors -- --dry-run

# Run for real
npm run sync:stripe-donors
```

Requires `STRIPE_API_KEY` and `POSTGRES_URL` in `.env.local`.
