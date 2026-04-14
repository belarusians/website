# Newsletter Subscriptions Foundation

## Overview
Establish the single source of truth for newsletter recipients. The first newsletter is a monthly **financial report** aimed at the internal team and **active monthly donors** — people who currently maintain a recurring donation. When their monthly donation stops, they stop receiving the report (auto-unsubscribe). Event-notification newsletters will reuse the same table later.

This plan covers the storage + enrollment + auto-unsubscribe plumbing only — **not** the actual email sending. A follow-up plan will wire the email provider, welcome emails, and the monthly report dispatcher.

Concrete deliverables:
- `subscriptions` table in Vercel Postgres keyed on (email, newsletter_type).
- `/api/newsletter/unsubscribe` endpoint that accepts an opaque token and flips status.
- Stripe subscription webhook listener that:
  - enrolls new monthly donors **immediately** after their 1st successful invoice (if they opted in on the donate page),
  - auto-unsubscribes them when the Stripe subscription is cancelled / lapses.
- Backfill script that enrolls current monthly donors who already have **≥2 successful monthly invoices** (stricter bar for retroactive consent).
- Checkbox (default checked) on the donate page for recurring donations, propagated via Stripe metadata.

Explicit non-goals (deferred to follow-up plans):
- Sending any email (welcome, monthly report, dispatch cadence, templates, provider integration).
- Admin UI for managing subscribers.
- Double opt-in confirmation flow.
- Internal recipient `mara@belarusians.nl` — not stored here; injected at send time.
- Events newsletter UX (the type is supported in the schema but no enrollment path in this plan).

## Context (from discovery)
- **No database exists**: this is the repo's first DB. `package.json` has no ORM/pg clients.
- **Stripe is wired**: `src/lib/stripe.ts` exposes a configured client and `constructWebhookEvent()`. An existing webhook listener `src/app/api/clickmeeting/route.ts` handles `checkout.session.completed` (signature verification + rate limiting pattern to reuse).
- **Donate flow**: `src/app/api/donate/link/route.ts` creates Stripe Payment Links and supports `recurring=true`. `src/app/[lang]/donate/donate-buttons.tsx` is the client form with preset amounts — no opt-in checkbox today.
- **API route style**: `src/app/api/utils.ts` exposes `sendError`/`sendSuccess`. Zod validation with `safeParse`, rate limiting via `checkRateLimit`, inline validation per route (see `src/app/api/subscribe/route.ts`).
- **Testing**: only `src/lib/__tests__/email.test.ts` exists. Jest + `@jest/globals`, pure-function style.
- **Env vars**: read directly from `process.env.*`; each call site validates presence and throws on missing. No central config module.
- **Scripts**: no `scripts/` directory yet — needs to be created.

## Decisions (made during planning)
- **DB client**: raw `@vercel/postgres` with the `sql` template tag (no ORM).
- **Migrations**: plain SQL files in `db/migrations/NNNN_name.sql` + a small `scripts/migrate.ts` runner exposed as `npm run db:migrate`. Tracking via a `_migrations` table.
- **Unsubscribe token**: random opaque token (32 bytes, base64url) stored in `unsubscribe_token` column. Verified by direct DB lookup. Per-row and revocable by rotating the column.
- **Scripts**: `scripts/*.ts` run via `tsx`, exposed as `npm run <name>`. Loads env from `.env.local` via `dotenv`.
- **Opt-in capture**: checkbox on the donate page (default checked) — only rendered when the donation is recurring. Value forwarded to the Stripe Payment Link via `subscription_data.metadata.newsletter_optin`.
- **Webhook enrollment rule**: enroll on the **1st successful `invoice.payment_succeeded`** for a given Stripe subscription where the opt-in flag on the subscription is truthy. New monthly donors start receiving the report as soon as their first payment clears.
- **Backfill enrollment rule**: enroll existing Stripe customers whose active subscription has **≥2 paid invoices**. The stricter bar is the retroactive-consent safeguard for donors who never saw the opt-in checkbox. Rows get `welcome_email_pending=true` so the future email plan can notify them before the first report arrives.
- **Auto-unsubscribe trigger**: on `customer.subscription.deleted` and on `customer.subscription.updated` when the new status is one of `canceled`, `unpaid`, `incomplete_expired`, or `past_due` (terminal failures). Flip status to `unsubscribed` with `unsubscribe_source='stripe_subscription_lapsed'` so it's distinguishable from user-initiated unsubscribes.
- **Welcome email**: deferred. Plan records intent (column) but does not send anything.
- **Internal group (`mara@belarusians.nl`)**: not stored here. Handled at send-time by the future dispatcher.

## Development Approach
- **Testing approach**: Regular (code first, then tests). Pure logic gets unit tests; DB + Stripe I/O is validated manually.
- Complete each task fully before moving to the next. Small, focused changes.
- Each task adds unit tests for the pure helpers it introduces (token generation, email normalisation, webhook event classification, opt-in flag parsing, backfill eligibility rule).
- All tests must pass before starting the next task.
- Update this plan file if scope changes during implementation (➕ for added tasks, ⚠️ for blockers).

## Testing Strategy
- **Unit tests**: required for token generator, email normaliser, opt-in flag parser, subscription-event classifier (enroll / lapse / skip), and the backfill eligibility predicate.
- **No DB integration tests**: raw SQL paths are exercised manually against a dev Postgres DB. Steps listed in Post-Completion.
- **No E2E tests**: the project has no Playwright/Cypress setup; donate-page checkbox verified manually in dev.

## Progress Tracking
- Mark completed items with `[x]` immediately when done.
- Add newly discovered tasks with ➕ prefix.
- Document issues/blockers with ⚠️ prefix.
- Update plan if implementation deviates from original scope.

## What Goes Where
- **Implementation Steps** (`[ ]` checkboxes): code, migrations, tests, doc updates in this repo.
- **Post-Completion** (no checkboxes): Vercel Postgres provisioning, Stripe webhook endpoint config, running the backfill, manual donate-page verification, the follow-up email plan.

## Implementation Steps

### Task 1: Provision DB client and migration runner
- [x] add `@vercel/postgres` to dependencies and `tsx`, `dotenv` to devDependencies
- [x] create `src/lib/db.ts` re-exporting `sql` from `@vercel/postgres`, with a startup check that `POSTGRES_URL` is set (matches existing env-var-guard style)
- [x] create `db/migrations/` directory with a README noting the naming convention (`NNNN_name.sql`)
- [x] create `scripts/migrate.ts` that reads migrations from `db/migrations/`, tracks applied ones in `_migrations(name text primary key, applied_at timestamptz)`, and applies pending ones in order inside a transaction
- [x] add `"db:migrate": "tsx scripts/migrate.ts"` to package.json scripts
- [x] write unit tests for the migration-file discovery/ordering helper (pure function over a directory listing)
- [x] run tests — must pass before task 2

### Task 2: Add subscriptions table migration
- [x] create `db/migrations/0001_subscriptions.sql` defining:
  - `id uuid primary key default gen_random_uuid()` (enable `pgcrypto` if not present)
  - `email text not null` (stored lowercased/trimmed)
  - `newsletter_type text not null` with CHECK constraint: `('financial_report','events')`
  - `status text not null default 'active'` with CHECK constraint: `('active','unsubscribed')`
  - `unsubscribe_token text not null unique`
  - `stripe_customer_id text` (nullable; used to match lapse events back to rows)
  - `stripe_subscription_id text` (nullable; captures which Stripe subscription drives this enrollment)
  - `source text not null` — one of `'stripe_webhook'`, `'stripe_backfill'`, `'manual'`
  - `unsubscribe_source text` — set on unsubscribe: `'user'`, `'stripe_subscription_lapsed'`
  - `welcome_email_pending boolean not null default true`
  - `welcome_email_sent_at timestamptz`
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`
  - `unique(email, newsletter_type)`
  - index on `unsubscribe_token`
  - index on `stripe_subscription_id` (for fast lapse lookup)
- [x] verify migration runs cleanly against a local/dev Postgres (documented in Post-Completion)
- [x] no unit tests in this task (pure SQL); covered by manual verification + downstream task tests
- [x] run full test suite — must pass before task 3

### Task 3: Build subscription service module
- [x] create `src/lib/subscriptions/service.ts` with:
  - `generateUnsubscribeToken(): string` — 32 random bytes, base64url
  - `normalizeEmail(email: string): string` — lowercase + trim
  - `upsertActiveSubscription({ email, newsletterType, stripeCustomerId?, stripeSubscriptionId?, source }): Promise<{ created: boolean; reactivated: boolean }>` — INSERT ... ON CONFLICT (email, newsletter_type); if existing row is `unsubscribed` and `unsubscribe_source = 'stripe_subscription_lapsed'`, reactivate it (new token, `welcome_email_pending=true`); if it's `unsubscribed` due to `'user'`, do NOT reactivate
  - `findByUnsubscribeToken(token): Promise<Subscription | null>`
  - `markUnsubscribed(id: string, unsubscribeSource: 'user' | 'stripe_subscription_lapsed'): Promise<void>`
  - `markUnsubscribedByStripeSubscriptionId(subscriptionId: string): Promise<void>` — used by the lapse handler
  - `markWelcomeEmailSent(id: string): Promise<void>` — for the future email plan
- [x] create `src/lib/subscriptions/types.ts` with `NewsletterType`, `SubscriptionStatus`, `UnsubscribeSource` unions and the `Subscription` record type matching the table
- [x] write unit tests for `generateUnsubscribeToken` (length, uniqueness across N calls, url-safe charset)
- [x] write unit tests for `normalizeEmail` (mixed case, surrounding spaces, already normalised)
- [x] run tests — must pass before task 4

### Task 4: Implement `/api/newsletter/unsubscribe` endpoint
- [x] create `src/app/api/newsletter/unsubscribe/route.ts` exporting `GET` (for link clicks) and `POST` (for form confirmation):
  - parse `token` from query (GET) or body (POST) with Zod
  - rate-limit via existing `checkRateLimit` helper
  - look up via `findByUnsubscribeToken`; if missing → `sendError(404, 'invalid token')` (opaque wording; never reveal whether the email exists)
  - if already `unsubscribed` → `sendSuccess('already unsubscribed')` (idempotent)
  - otherwise `markUnsubscribed(id, 'user')` and return `sendSuccess`
- [x] write unit tests for the Zod token schema (valid/invalid shapes)
- [x] write unit tests for any pure response-builder helper factored out (no separate response-builder needed; handleUnsubscribe is thin over service calls)
- [x] run tests — must pass before task 5

### Task 5: Donate page newsletter opt-in + Payment Link metadata
- [ ] add a checkbox to `src/app/[lang]/donate/donate-buttons.tsx` (default checked). Only render/submit when the donation is recurring. Labels via i18n keys (`newsletter_optin`) in `src/app/i18n/locales/{be,nl}/donate.json`
- [ ] pass the checkbox value to `/api/donate/link` as a query param (`newsletterOptin=true|false`)
- [ ] in `src/app/api/donate/link/route.ts`:
  - extend the Zod schema to accept `newsletterOptin` (boolean, coerced)
  - ignore the flag when `recurring=false`
  - when creating the recurring Payment Link, add `subscription_data.metadata.newsletter_optin` so it lands on the resulting Stripe `Subscription` (read by webhook invoice handlers)
- [ ] write unit tests for the updated Zod schema (presence, absence, boolean coercion, non-recurring case ignored)
- [ ] run tests — must pass before task 6

### Task 6: Stripe webhook listener for subscription lifecycle
- [ ] create `src/app/api/webhooks/stripe-newsletter/route.ts` that:
  - verifies signature with `constructWebhookEvent` using a new `STRIPE_NEWSLETTER_WEBHOOK_SECRET`
  - rate-limits (follow existing pattern)
  - dispatches based on `event.type`:
    - `invoice.payment_succeeded` → enrollment path
    - `customer.subscription.deleted` → lapse path
    - `customer.subscription.updated` → lapse path if new `status` ∈ {`canceled`,`unpaid`,`incomplete_expired`,`past_due`}
    - everything else → return 200 `{ skipped: true }`
  - always return 200 on handled events (so Stripe does not retry)
- [ ] **Enrollment path (`invoice.payment_succeeded`)**:
  - skip when invoice has no associated subscription (one-off charges)
  - fetch the Stripe Subscription (via `stripe.subscriptions.retrieve`) to read `metadata.newsletter_optin`
  - if opt-in is not truthy, skip
  - extract `email` from `invoice.customer_email` (fallback to `charge.billing_details.email` if expanded)
  - `upsertActiveSubscription({ email, newsletterType: 'financial_report', stripeCustomerId, stripeSubscriptionId, source: 'stripe_webhook' })` — idempotent: 2nd, 3rd, Nth invoices for the same subscription are no-ops
- [ ] **Lapse path**:
  - extract `subscription.id` and call `markUnsubscribedByStripeSubscriptionId(subscription.id)`
- [ ] factor out pure helpers: `classifySubscriptionEvent(event)` (returns `'enroll' | 'lapse' | 'skip'`), `parseOptInFlag(metadata)`, `extractEnrollmentEmail(invoice, charge?)`. Keep Stripe API calls outside these helpers.
- [ ] write unit tests for `classifySubscriptionEvent` covering: enroll on any invoice.payment_succeeded tied to a subscription, skip on invoice.payment_succeeded without subscription, skip on unrelated event, lapse on subscription.deleted, lapse on subscription.updated (each terminal status), no-lapse on subscription.updated → status=active
- [ ] write unit tests for `parseOptInFlag` (`"true"`, `true`, `"false"`, missing, garbage)
- [ ] write unit tests for `extractEnrollmentEmail` (invoice.customer_email primary, billing_details fallback, missing → null)
- [ ] run tests — must pass before task 7

### Task 7: Stripe backfill script for current monthly donors (≥2 paid invoices)
- [ ] create `scripts/sync-stripe-donors.ts` that:
  - loads `.env.local` via dotenv
  - paginates Stripe `subscriptions.list({ status: 'active' })`
  - for each subscription, fetch paid invoices via `invoices.list({ subscription: sub.id, status: 'paid', limit: 100 })`
  - apply the eligibility predicate: `paidInvoiceCount >= 2`
  - resolve the email: subscription's customer's `email`, fallback to the latest paid invoice's `customer_email`
  - dedup by normalised email within a run
  - for each eligible unique email, `upsertActiveSubscription({ email, newsletterType: 'financial_report', stripeCustomerId, stripeSubscriptionId, source: 'stripe_backfill' })`
  - log a summary: `{ subscriptions_scanned, eligible, inserted, already_existed, skipped_unsubscribed }`
  - support `--dry-run` flag
- [ ] add `"sync:stripe-donors": "tsx scripts/sync-stripe-donors.ts"` to package.json scripts
- [ ] factor out `isEligibleForBackfill(subscription, paidInvoiceCount): boolean` as a pure helper
- [ ] write unit tests for `isEligibleForBackfill` (active + ≥2 invoices → true; active + 1 invoice → false; past_due → false; canceled → false)
- [ ] write unit tests for the in-run dedup/normalisation logic
- [ ] run tests — must pass before task 8

### Task 8: Verify acceptance criteria
- [ ] verify migration runs cleanly on a fresh DB and is idempotent (re-running `npm run db:migrate` is a no-op)
- [ ] verify unit tests pass: `npm run test`
- [ ] verify typecheck: `npm run typecheck`
- [ ] verify lint: `npm run lint` — all issues fixed
- [ ] verify all deliverables from Overview are implemented (table, unsubscribe endpoint, webhook with enrollment + lapse paths, backfill, donate checkbox)
- [ ] verify webhook route builds under `next build`

### Task 9: [Final] Update documentation
- [ ] update `CLAUDE.md`:
  - add `POSTGRES_URL` and `STRIPE_NEWSLETTER_WEBHOOK_SECRET` to env var list
  - add a short "Database" section describing the raw-sql + migrations convention
  - add the new webhook (`/api/webhooks/stripe-newsletter`) to the Webhooks table with its listed events
  - note the enrollment rules (webhook: opt-in + 1st paid invoice; backfill: ≥2 paid invoices) and the lapse rule in the Architectural Decisions section
- [ ] add `db/README.md` explaining how to add a migration and run `npm run db:migrate`
- [ ] add `scripts/README.md` listing `migrate` and `sync-stripe-donors` and how to run them
- [ ] add a short note at the end of the plan: the welcome-email plan picks up rows with `welcome_email_pending=true`

## Technical Details

### Table shape (authoritative)
```
subscriptions (
  id uuid pk default gen_random_uuid(),
  email text not null,
  newsletter_type text not null check (newsletter_type in ('financial_report','events')),
  status text not null default 'active' check (status in ('active','unsubscribed')),
  unsubscribe_token text not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  source text not null,
  unsubscribe_source text,
  welcome_email_pending boolean not null default true,
  welcome_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, newsletter_type)
)
```
`updated_at` is set explicitly in each update statement (no trigger).

### Enrollment semantics
- **Webhook path (new donors going forward)**: require opt-in flag on subscription metadata. Enroll on 1st paid invoice. Subsequent invoices for the same subscription are idempotent no-ops.
- **Backfill path (existing donors)**: require active subscription AND ≥2 paid invoices. No opt-in flag available — retroactive consent is handled by the welcome email the follow-up plan will send before the first financial report.
- Existing row, status=`active` → no change (preserve token so prior unsubscribe links still work; keep `welcome_email_pending` as-is).
- Existing row, status=`unsubscribed`, `unsubscribe_source='user'` → do NOT reactivate. Respect user decision.
- Existing row, status=`unsubscribed`, `unsubscribe_source='stripe_subscription_lapsed'` → reactivate (new token, `welcome_email_pending=true`) when they resume donating.

### Lapse semantics
On `customer.subscription.deleted` or `customer.subscription.updated` → status ∈ {`canceled`,`unpaid`,`incomplete_expired`,`past_due`}:
- Find rows by `stripe_subscription_id` and flip status to `unsubscribed` with `unsubscribe_source='stripe_subscription_lapsed'`.
- Token is **not** rotated on lapse (future reactivation preserves audit trail).

### Opt-in flag conventions
- Checkbox on donate page: boolean. Only shown for recurring donations.
- URL query to `/api/donate/link`: `newsletterOptin=true|false`.
- Stripe: stored on `subscription_data.metadata.newsletter_optin` so every invoice event can read it by retrieving the Subscription.
- Webhook treats only literal `"true"` or boolean `true` as opt-in.

### Unsubscribe URL shape (for future email templates)
```
https://belarusians.nl/api/newsletter/unsubscribe?token=<base64url-32-bytes>
```
JSON response today; a user-facing confirmation page can be added with the email plan.

## Post-Completion

**Vercel / Stripe setup (manual, outside the repo):**
- Provision Vercel Postgres, copy `POSTGRES_URL` into Vercel env vars and local `.env.local`.
- Run `npm run db:migrate` against the dev DB, then against production once verified.
- Create a new Stripe webhook endpoint pointing at `/api/webhooks/stripe-newsletter` listening to `invoice.payment_succeeded`, `customer.subscription.deleted`, `customer.subscription.updated`. Copy the signing secret into `STRIPE_NEWSLETTER_WEBHOOK_SECRET`.
- Run `npm run sync:stripe-donors -- --dry-run`, review counts, then run without the flag.

**Manual verification:**
- Test donation in Stripe test mode, recurring, checkbox checked → after 1st invoice payment, row appears with `source='stripe_webhook'`, `welcome_email_pending=true`.
- 2nd/3rd invoice on the same subscription → no duplicate row, no changes.
- Cancel the Stripe subscription → row flips to `unsubscribed` with `unsubscribe_source='stripe_subscription_lapsed'`.
- Re-subscribe with the same customer + opt-in → row reactivates on 1st invoice of the new subscription.
- Donate recurring with checkbox unchecked → no row ever created even after many invoices.
- One-off donation → no row ever created.
- User clicks `/api/newsletter/unsubscribe?token=...` → row flips to `unsubscribed` with `unsubscribe_source='user'`. Re-subscribing in Stripe does NOT reactivate.

**Deferred (future plans):**
- Welcome-email dispatcher: pick up rows with `welcome_email_pending=true`, send the "you'll start receiving the monthly financial report" email, mark `welcome_email_sent_at`. Run once for the backfill before the first report; on an ongoing basis for new enrollments.
- Monthly financial-report dispatcher: select `status='active' AND newsletter_type='financial_report'` + internal fixed recipient `mara@belarusians.nl`, render template, send.
- Events newsletter enrollment UX (type already supported in the schema).
- Admin UI for listing/exporting subscribers.
- Double opt-in / consent log if required after legal review.