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