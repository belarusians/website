# CLAUDE.md

Website for MARA, a non-profit organization of Belarusians in the Netherlands. Next.js 15 App Router, React 19, TypeScript, TailwindCSS 4, Sanity 3 CMS, Clerk auth, Stripe payments, i18next (Belarusian/Dutch), AWS S3 storage.

## Commands
- `npm run dev` / `npm run dev:turbo` — dev server
- `npm run build` — production build
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run test` / `npx jest -t "pattern"` — Jest tests
- `npm run sanity:types` — regenerate Sanity TypeGen types (run after schema changes)

## Code Style
- Prettier: 120 chars, single quotes, 2-space indent
- camelCase for variables/functions, PascalCase for components/types
- Path alias: `@/*` → `./src/*`
- Tests: `__tests__/` dirs, `.test.ts` extension

### Theme tokens
- CSS source of truth: `@theme` block in `src/components/globals.css` (Tailwind 4 custom properties).
- TSX/TS source of truth: `src/theme/tokens.ts` (`COLORS`, `PRIMARY`) — import from `@/theme/tokens` instead of inlining hex literals.
- Keep both in sync; the Next.js metadata API only accepts plain strings, so JS consumers cannot read CSS variables directly.

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
src/components/          Reusable UI: button, card, consent/, dropdown, header/, headings/, menu/, section, spinner, image
src/components/types.ts  Lang enum (be, nl), domain types (Event, News, Guide, Feedback)
src/sanity/              CMS schemas: event/, news/, guide/, feedback/, vacancy/, locale-schemas/
src/lib/                 Integrations: stripe, s3, email, clickmeeting, google-directory, vacancies, consent
src/theme/               Design tokens: tokens.ts (COLORS, PRIMARY) — keep in sync with globals.css @theme
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
Translation files at `src/app/i18n/locales/{be,nl}/`. Namespaces: about-us, alien-passport, common, consent, donate, events, help, join-us, kupalle, main, reports, vacancies. Default namespace: common. Fallback language: be.

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

### JSON-LD (SEO structured data)
Builders live in `src/lib/jsonld.ts` (`buildSiteJsonLd`, `eventJsonLd`); pages render the output inline via `<Script type="application/ld+json" dangerouslySetInnerHTML>` — no shared component wrapper.

### Visual foundations (refreshed)
- Buttons translate on hover/active (`hover:-translate-y-0.5`, `active:translate-y-px`) alongside shadow escalation. Defined in `src/components/button.tsx`.
- The rainbow gradient is a seamless conic rotation driven by `@property --mara-angle` via the `bg-rainbow-spin` utility in `globals.css`. Do not reintroduce `animation-duration` hover changes — they cause a visible jump.
- Logo has a `showSubtitle` prop for the two approved variants (`src/components/header/logo.tsx`); callers default to the subtitle-visible variant.

### Mobile chrome (header + tab bar)
Mobile chrome (header + bottom tab bar) is implemented from the kit at `ui_kits/mobile/`. Tab order, labels, colors, and the raised donate pill come from `ui_kits/mobile/Header.jsx` + `styles.css` — do not improvise them. Tabs: home, events, donate (center, conic-rainbow pill via `bg-rainbow-spin`), help (hub for passport + refugees-bot at `/[lang]/help`), about. Header uses `backdrop-blur-[16px] backdrop-saturate-[1.8] bg-white-shade/85`. `<TabBar lang={lang} />` is mounted in `src/app/[lang]/layout.tsx` as a sibling of the page flex column; the column carries `pb-[88px] md:pb-0` so footer + page content clear the fixed bar on mobile, and the consent banner/pill sit at `bottom-[88px]` on mobile (`md:bottom-[18px]`) for the same reason. The donate pill body color is painted by `bg-rainbow-spin` itself — that utility's base `background-color` is `var(--color-black)` (`#231F20`, the kit value), so the markup must NOT layer a redundant `bg-black`/`bg-black-tint` class on the same element. The tab bar's bottom padding is intentionally a fixed `pb-[34px]` (kit value) — do not switch to `env(safe-area-inset-bottom)`. The tab bar is `z-40` (not `z-50`) so that the hamburger drawer + dim overlay in `src/components/menu/mobile/mobileMenu.tsx` (rendered inside the header's `z-50` stacking context) paint above the tab bar when the menu is open — otherwise the bar would obstruct the bottom drawer items and swallow taps on the bottom of the dim overlay.

### Consent Mode v2 + cookie banner
gtag.js is mounted in `src/app/[lang]/layout.tsx` with all ad signals (`ad_storage`, `ad_user_data`, `ad_personalization`) defaulted to `denied`. The defaults are set by a **raw `<script>` tag with `dangerouslySetInnerHTML`** (not `next/script`): Next.js only honors `strategy="beforeInteractive"` in the **root** layout, so a nested-layout `next/script` would silently degrade to `afterInteractive` and could let gtag.js fire ad pixels before the consent default lands. The raw inline `<script>` renders into the SSR HTML in document order and runs synchronously before the subsequent async gtag.js `<Script>` — preserving the "default-denied first" guarantee while keeping gtag scoped to `[lang]` (so `/studio` stays gtag-free). `<ConsentBanner lang={lang} />` is a sibling of `{children}` and reads/writes localStorage key `mara_consent` (shape `{ choice, timestamp }`); helpers live in `src/lib/consent.ts`. The component is a three-mode state machine driven by `decideRenderMode(state, hasStoredChoice)`: `'banner'` (visible card with Accept/Decline) when `state === 'visible'`, `'pill'` (small "Cookies" reopen pill bottom-left) when `state === 'hidden'` and a stored choice exists, and `'none'` when `state === 'hidden'` with no stored choice (post-SSR, pre-hydration only). On mount the component calls `applyStoredConsent` (re-upgrades gtag if the stored choice was `'granted'`) and then either flips to `'visible'` (no stored choice → first visit) or sets `hasStoredChoice = true` (stored choice → render the pill). Accept calls `recordAccept` (`writeConsent('granted')` + `applyConsent('granted')`), Decline calls `recordDecline` (`writeConsent('denied')` + `applyConsent('denied')` — the explicit downgrade matters because the user may be revoking after a prior grant via the reopen pill; for a first-time decline gtag is already at default-denied so the call is a no-op), and clicking the pill flips state back to `'visible'` without touching gtag. Conversion tracking (`window.gtag_report_conversion` used by `event-article.tsx`) is gated by Consent Mode — never bypass by calling `gtag('event', 'conversion', ...)` directly without going through consent. Action buttons use the shared `<Button>` component (`src/components/button.tsx`) with `variant="ghost"` for Decline and `variant="primary"` for Accept, both at `size="sm"`. The `variant` system was added so the consent banner could share Button's hover/active translate-y pattern instead of duplicating it; `variant="primary"` adds `bg-primary text-white active:bg-primary-shade`, `variant="ghost"` adds `bg-white text-black-tint active:bg-white-shade`, and `size="sm"` resolves to `px-4 py-2.5 text-sm font-normal`. Existing call sites that style via `className` keep working because `variant` is optional and defaults to no color classes. The reopen pill stays as a raw `<button>` in `banner.tsx` because it needs `rounded-full` + custom typography that don't fit `<Button>` without further generalization.

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
8. Cookie banner only shows under `[lang]` routes; `/studio` (route group) is intentionally not gated and intentionally has no gtag