# Architecture Guide for AI Agents

> **Purpose**: Quick navigation guide to find information efficiently. Code is self-documented - this shows you where to look.

## Quick Reference

**Stack**: Next.js 15 (App Router) + TypeScript + Sanity CMS + Clerk Auth + Stripe + Tailwind CSS
**Languages**: Belarusian (be), Dutch (nl) - all routes use `[lang]` parameter
**Build Commands**: See `CLAUDE.md`

## Where to Find Things

### Routes & Pages
- **All routes**: `/src/app/[lang]/*` - locale-first routing enforced by middleware
- **Layouts**: `/src/app/[lang]/layout.tsx` - Clerk provider, i18n, header/footer
- **API routes**: `/src/app/api/*/route.ts` - RESTful endpoints
- **Sanity Studio**: `/src/app/(sanity)/studio/` - CMS admin at `/studio`

### Content Management (Sanity)
- **Schemas**: `/src/sanity/[type]/schema.ts` - event, news, guide, vacancy, feedback
- **Queries**: `/src/sanity/[type]/service.ts` - GROQ queries with cache tags
- **Types**: `/src/sanity/[type]/type.ts` - TypeScript definitions
- **Multi-language fields**: `/src/sanity/locale-schemas/` - localeString, localeText, localeContent
- **Config**: `/sanity.config.ts` + `/src/sanity/env.ts`

### External Integrations
- **Stripe**: `/src/lib/stripe.ts` - payments (products, prices, payment links)
- **Google Workspace**: `/src/lib/google-directory.ts` - role-based access (Admin/Editor/Member)
- **S3**: `/src/lib/s3.ts` - form submissions storage
- **ClickMeeting**: `/src/lib/clickmeeting.ts` - video conference invites

### Internationalization
- **Config**: `/src/app/i18n/settings.ts` - supported languages
- **Translations**: `/src/app/i18n/locales/{be,nl}/translation.json`
- **Server**: `/src/app/i18n/index.ts` - server-side i18n
- **Client**: `/src/app/i18n/client.ts` - useTranslation hook

### Components
- **Global**: `/src/components/` - button, card, image, header, footer
- **Locale-specific**: `/src/components/[lang]/` - locale-aware components
- **Styles**: `/src/components/globals.css` - Tailwind configuration

### Configuration
- **Next.js**: `next.config.js` - image domains, redirects
- **TypeScript**: `tsconfig.json` - strict mode, path aliases (`@/*` → `./src/*`)
- **Environment**: `.env.development`, `.env.production`

## Key Patterns

### 1. Locale Handling
- Every page/route must support both `be` and `nl`
- Middleware (`/src/middleware.ts`) enforces locale prefix
- Use `generateStaticParams()` for static generation
- Translations in `/src/app/i18n/locales/{lang}/translation.json`

### 2. Content from Sanity
```
Page → Service (GROQ query) → Portable Text → HTML → Render
```
- All fetches use `force-cache` with cache tags
- ISR via webhooks to `/api/revalidate`
- Cache tags: `event`, `news`, `guide`, `vacancy`, `feedback`

### 3. API Routes
- Validation: Zod schemas in `/src/contract/`
- Response format: `{ success: true, data: {...} }` or `{ error: "..." }`
- Webhooks verify signatures (Sanity HMAC, Stripe, Clerk Svix)

### 4. Authentication & Authorization
```
Clerk (auth) → Google Workspace API (groups) → Role mapping
```
- Roles: Admin (administratie@), Editor (editors@), Member (default)
- See `/src/lib/google-directory.ts` for role logic

## Common Tasks

### Add New Content Type
1. Schema: `/src/sanity/[type]/schema.ts`
2. Service: `/src/sanity/[type]/service.ts` (GROQ queries + cache tags)
3. Types: `/src/sanity/[type]/type.ts`
4. Route: `/src/app/[lang]/[type]/page.tsx`
5. Revalidation: Update `/src/app/api/revalidate/route.ts`
6. Register: Update `/sanity.config.ts`

### Add New API Endpoint
1. Route: `/src/app/api/[name]/route.ts`
2. Validation: `/src/contract/[name].ts` (Zod schema)
3. Integration: Use clients from `/src/lib/` if needed

### Add New Page
1. Route: `/src/app/[lang]/[route]/page.tsx`
2. Translations: `/src/app/i18n/locales/{be,nl}/translation.json`
3. Metadata: Implement `generateMetadata()`
4. Components: `/src/components/[lang]/[route]/` (if route-specific)

### Add External Integration
1. Client: `/src/lib/[service].ts`
2. Environment vars: `.env.*` files
3. Types: Define API response types
4. Use in: API routes for orchestration

## Data Flow Essentials

**Page Render**: Middleware → Router → Layout → Page → Sanity query → Static HTML (ISR)

**Content Update**: Sanity edit → Webhook → `/api/revalidate` → Next.js cache invalidation → Regenerate

**Donation**: Form → `/api/donate/link` → Stripe Payment Link → User pays → Stripe webhook → `/api/clickmeeting` → ClickMeeting invite

**Subscription/Application**: Form → API route → S3 storage (JSON files)

## Troubleshooting Entry Points

- **ISR not working**: Check `/api/revalidate` logs, Sanity webhook delivery, `SANITY_REVALIDATE_SECRET`
- **Auth issues**: Check Clerk dashboard, Google Workspace service account, group memberships
- **Build errors**: Run `npm run typecheck`, `npm run lint`, check environment variables
- **Payment flow**: Verify Stripe keys, webhook signatures, product IDs

## Critical Conventions

✓ Always use `[lang]` in routes
✓ Attach cache tags to all Sanity fetches
✓ Validate API inputs with Zod
✓ Never use `any` type (strict mode)
✓ Add translations for both `be` and `nl`
✓ Use path aliases (`@/lib/...` not `../../lib/...`)
✓ Mock external services in tests

## Related Docs

- `CLAUDE.md` - Build commands, code style, testing
- `INTEGRATIONS.md` - External service API details and env vars
- `DATA_FLOWS.md` - Detailed flow diagrams if you need them
