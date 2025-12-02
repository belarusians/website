# Architecture Insights for AI Agents

> **Purpose**: High-level insights and architectural decisions. Code is self-documented - read it directly. This shows you what's non-obvious and where to look.

## System Overview

**Stack**: Next.js 15 (App Router) + TypeScript + Sanity CMS + Clerk Auth + Stripe
**Key Insight**: Multilingual (be/nl) with locale-first routing via `[lang]` parameter throughout

## Critical Architectural Decisions

### 1. Locale-First Routing Pattern
**Decision**: Every route uses `/[lang]/...` enforced by middleware
**Why**: SEO, consistent URLs, server-side locale detection
**Implication**: When adding routes, always include `[lang]` parameter and `generateStaticParams()` for both locales
**Entry point**: `src/middleware.ts:15`

### 2. ISR with Webhook-Triggered Revalidation
**Decision**: `force-cache` + tag-based revalidation via Sanity webhooks
**Why**: Performance of static sites, freshness within minutes, no manual deploys
**Gotcha**: Revalidation is type-level (all events), not document-level (one event)
**Entry points**:
- Cache tags: `src/sanity/*/service.ts` (search for `tags:`)
- Revalidation: `src/app/api/revalidate/route.ts:24`

### 3. Multi-Language Content Schema
**Decision**: Custom Sanity field types (localeString, localeText, localeContent)
**Why**: Structured multi-language support, fallback to Belarusian, type safety
**Gotcha**: GROQ projections must extract locale: `localeString[lang] as "title"`
**Entry point**: `src/sanity/locale-schemas/`

### 4. S3 for Form Submissions (Not Database)
**Decision**: Store subscriptions/applications as JSON files in S3
**Why**: Simple, cheap, no complex queries needed, no database maintenance
**Implication**: No search/filter capability - manual download from S3 console
**Entry points**:
- `src/lib/s3.ts:12`
- `src/app/api/subscribe/route.ts:18`
- `src/app/api/vacancies/apply/route.ts:22`

### 5. Google Workspace for RBAC
**Decision**: Fetch user roles from Google Groups instead of custom role management
**Why**: Organization already uses Google Groups, no duplicate user management
**Gotcha**: Requires service account with domain-wide delegation, impersonates admin
**Entry point**: `src/lib/google-directory.ts:28`

## Important Patterns & Gotchas

### Portable Text Transformation
**Pattern**: Sanity stores rich text as Portable Text blocks → convert to HTML server-side
**Why**: Structured content, multi-language support, not just HTML strings
**Where**: All `src/sanity/*/service.ts` files use `@portabletext/to-html`

### Stripe Payment → ClickMeeting Flow
**Non-obvious**: Donation payments trigger automatic ClickMeeting invitations
**How**: Stripe webhook checks product ID → if match, extracts email → sends ClickMeeting invite
**Gotcha**: Product ID must be configured in webhook handler for invite to trigger
**Entry point**: `src/app/api/clickmeeting/route.ts:35`

### Authentication vs Authorization
**Insight**: Clerk handles authentication, Google Workspace handles authorization
**Flow**: User signs in (Clerk) → backend fetches Google Groups → maps to role (Admin/Editor/Member)
**Gotcha**: User must be in Google Group to get elevated permissions, not managed in app
**Entry point**: `src/lib/google-directory.ts:45`

### Cache Tag Strategy
**Insight**: Revalidation granularity is by content type, not by document
**Why**: Simpler webhook logic, acceptable staleness trade-off
**Implication**: Publishing one event regenerates all event pages, not just that one
**Tags**: `event`, `news`, `guide`, `vacancy`, `feedback`

## Directory Structure Logic

```
/src/app/[lang]/        → All user-facing routes (locale-specific)
/src/app/api/           → Backend API routes (webhooks, form handlers)
/src/app/(sanity)/      → Sanity Studio isolated in route group
/src/sanity/[type]/     → Content schemas + queries + types (co-located)
/src/lib/               → External service clients (Stripe, S3, Google, etc.)
/src/contract/          → Zod validation schemas for API routes
/src/components/        → React components (organized by route)
```

**Insight**: Sanity content types co-locate schema/service/type in same directory for cohesion

## Key Constraints

1. **Always support both languages** (`be` and `nl`) when adding features
2. **Attach cache tags** to all Sanity fetches for ISR to work
3. **Validate API inputs** with Zod schemas in `/src/contract/`
4. **Never use `any` type** - strict mode enabled, all types must be defined
5. **Translations required** in both `/src/app/i18n/locales/{be,nl}/translation.json`
6. **Path aliases** - use `@/lib/...` not `../../lib/...`

## Common Pitfalls

1. **Forgetting `[lang]` parameter** in new routes breaks middleware
2. **Missing cache tags** prevents ISR from updating content
3. **GROQ without locale projection** returns entire localeString object, not string
4. **Missing translations** breaks pages in one language
5. **Webhook signature not verified** creates security vulnerability
6. **Google private key newlines** must be preserved (`\n` → actual newline)

## Where to Find Things

Use Glob/Grep to find specific functionality:
- **Routes**: `src/app/[lang]/**/*.tsx`
- **API endpoints**: `src/app/api/**/route.ts`
- **Sanity schemas**: `src/sanity/*/schema.ts`
- **GROQ queries**: `src/sanity/*/service.ts`
- **External integrations**: `src/lib/*.ts`
- **Validation**: `src/contract/*.ts`
- **Translations**: `src/app/i18n/locales/`

## Testing Strategy Insight

**No E2E tests** - reliance on TypeScript strict mode + linting to catch errors at compile time
**Implication**: When adding features, ensure strong typing to prevent runtime errors
**CI**: ESLint + Jest on PRs, but test coverage is minimal

## Related Docs

- `DATA_FLOWS.md` - Key data flow insights and tracing tips
- `INTEGRATIONS.md` - Environment variables and integration gotchas
- `CLAUDE.md` - Build commands and code style rules
