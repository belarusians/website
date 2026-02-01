# CLAUDE.md

Website for MARA, a non-profit organization of Belarusians in the Netherlands. Next.js 15 App Router, React 19, TypeScript, TailwindCSS 4, Sanity 3 CMS, Clerk auth, Stripe payments, i18next (Belarusian/Dutch), AWS S3 storage.

## Commands
- `npm run dev` / `npm run dev:turbo` — dev server
- `npm run build` — production build
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run test` / `npx jest -t "pattern"` — Jest tests

## Code Style
- Prettier: 120 chars, single quotes, 2-space indent
- camelCase for variables/functions, PascalCase for components/types
- Path alias: `@/*` → `./src/*`
- Tests: `__tests__/` dirs, `.test.ts` extension

## Project Layout
```
src/app/[lang]/          Pages (be, nl). Each page gets lang from CommonPageParams
src/app/[lang]/about-us, donate, events, events/[slug], join-us, news, news/[slug],
                sign-in, sign-up, vacancies, vacancies/[id]
src/app/(sanity)/studio  Sanity Studio (protected by Clerk)
src/app/api/             API routes: clickmeeting, donate, revalidate, subscribe, vacancies, webhooks
src/app/api/utils.ts     sendError(status, msg, reason?) / sendSuccess(msg) helpers
src/app/i18n/            i18n config + locales/{be,nl}/*.json
src/app/types.ts         CommonPageParams, PageSearchParams, PropsWithClass
src/components/          Reusable UI: button, card, dropdown, header/, headings/, menu/, section, spinner, image
src/components/types.ts  Lang enum (be, nl), domain types (Event, News, Guide, Feedback)
src/sanity/              CMS schemas: event/, news/, guide/, feedback/, vacancy/, locale-schemas/
src/lib/                 Integrations: stripe, s3, email, clickmeeting, google-directory, vacancies
src/utils/               Helpers: og.ts (OG images), lang.ts (validation)
src/middleware.ts        Clerk auth + locale redirect (default: be, /ru → /be redirect)
sanity.config.ts         Schema registration + type exports (EventSchema, NewsSchema, etc.)
```

## Key Patterns

### Pages
Server components. Receive `{ params }: CommonPageParams`, await params to get `lang`. Validate with `isValidLang()`, convert with `toLang()`. Use `getTranslation(lang, namespace)` from `@/app/i18n` for server-side translations. Use ISR via `export const revalidate = N`.

### Client Components
Use `'use client'` directive. Import `getTranslation` from `@/app/i18n/client` instead. Call as `const { t } = getTranslation(lang, namespace)`.

### i18n Namespaces
Translation files at `src/app/i18n/locales/{be,nl}/`. Namespaces: common, main, about-us, donate, events, guides, join-us, kupalle, vacancies. Default namespace: common. Fallback language: be.

### API Routes
Export async HTTP method handlers (GET, POST, etc.) in `route.ts`. Use `sendError`/`sendSuccess` from `@/app/api/utils`. Validate with Zod where applicable.

### Sanity Schemas
1. Define schema in `src/sanity/<type>/schema.ts`
2. Create service in `src/sanity/<type>/service.ts` for GROQ queries
3. Register schema in `sanity.config.ts` → `schema.types` array
4. Content types: event, news, guide, feedback, vacancy
5. Localized fields use locale-schemas: localeString, localeText, localeContent

### Data Flow
Content created in Sanity Studio → fetched by server components via Sanity service files → rendered as SSR/ISR → client components handle interactions → API routes handle form submissions and external integrations (Stripe, S3, ClickMeeting).

## Architectural Decisions (Non-Obvious)

### ISR with Webhook-Triggered Revalidation
All Sanity fetches use `force-cache` + tag-based revalidation. Sanity publish → webhook → `src/app/api/revalidate/route.ts` → `revalidateTag()`. Revalidation is **type-level** (all events), not document-level. Tags: `event`, `news`, `guide`, `vacancy`, `feedback`. If webhook fails, content stays stale until next deploy.

### Locale Projection in GROQ
GROQ queries must extract the locale, not return the full localeString object.
- Wrong: `localeString` → returns `{ be: "...", nl: "..." }`
- Correct: `localeString[$lang] as "title"` → returns string

### S3 for Form Submissions (No Database)
Subscriptions and vacancy applications are stored as JSON files in S3 (UUID filename). No search/query capability — manual download from S3 console. See `src/lib/s3.ts`.

### Auth: Clerk + Google Workspace RBAC
Clerk handles authentication. Google Workspace Groups determine authorization (Admin/Editor/Member). Role is fetched on-demand via service account with domain-wide delegation, not cached in session. User must be in Google Group for elevated permissions. See `src/lib/google-directory.ts`.

### Stripe → ClickMeeting Flow
Donation payments can trigger automatic ClickMeeting invitations. Stripe webhook checks product ID (hardcoded match) → extracts email → sends ClickMeeting invite. Product ID must be updated in code when creating new event products. See `src/app/api/clickmeeting/route.ts`.

### Portable Text → HTML
Sanity stores rich text as Portable Text blocks. Converted to HTML server-side in `src/sanity/*/service.ts` using `@portabletext/to-html`. Adding custom blocks requires serializer updates.

## Webhooks

| Service | Endpoint | Events | Verification |
|---------|----------|--------|--------------|
| Sanity | `/api/revalidate` | publish/update/delete | HMAC-SHA256 |
| Stripe | `/api/clickmeeting` | `checkout.session.completed` | Stripe SDK |
| Clerk | `/api/webhooks/clerk` | user.* | Svix |

All webhooks must verify signature before processing. Never skip verification.

## Environment Variables

```
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET (production)
NEXT_PUBLIC_SANITY_API_VERSION, SANITY_REVALIDATE_SECRET

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL (/[lang]/sign-in — must include [lang]!)
NEXT_PUBLIC_CLERK_SIGN_UP_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

# Stripe
STRIPE_SECRET_KEY (sk_test_ for dev, sk_live_ for prod), STRIPE_WEBHOOK_SECRET

# Google Workspace (RBAC)
GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY (preserve \n as actual newlines!)
GOOGLE_SUBJECT_EMAIL (admin@belarusians.nl)

# AWS S3
AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION (eu-central-1)
SUBSCRIPTIONS_BUCKET, APPLICATIONS_BUCKET

# ClickMeeting
CLICKMEETING_API_KEY, CLICKMEETING_ROOM_ID

# Umami Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID, NEXT_PUBLIC_UMAMI_URL
```

## Pitfalls
1. Forgetting `[lang]` parameter in new routes breaks middleware
2. Missing cache tags on Sanity fetches prevents ISR updates
3. GROQ without locale projection returns object instead of string
4. Missing translations in one language breaks that locale's pages
5. Google private key: `\n` must be actual newlines, not literal string
6. Stripe product ID for ClickMeeting invite is hardcoded — update when adding new event products
7. Clerk redirect URLs must include `[lang]`