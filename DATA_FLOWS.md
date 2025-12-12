# Data Flow Insights

> **Purpose**: Key insights about how data moves. Read the code for details - this highlights non-obvious patterns and important considerations.

## Critical Flow Insights

### ISR (Incremental Static Regeneration) Flow
**Key Insight**: Content updates are webhook-driven, not time-based
**Sequence**: Sanity publish → Webhook → Verify signature → Extract type → `revalidateTag()` → Next.js regenerates
**Non-obvious**: Revalidation is type-level (all events), not document-level (single event)
**Gotcha**: If webhook fails (wrong secret, network), content stays stale until next deployment
**Trace from**: `src/app/api/revalidate/route.ts:24`

### Multi-Language Content Resolution
**Key Insight**: Locale extraction happens in GROQ query, not in component
**Pattern**: `localeString[lang] as "title"` → TypeScript receives `{ title: string }`, not `{ localeString: { be: string, nl: string } }`
**Why**: Reduces payload size, simplifies component logic, type-safe
**Gotcha**: Forgetting locale projection returns entire object, breaking type expectations
**Example**: `src/sanity/event/service.ts:42`

### Stripe → ClickMeeting Integration
**Key Insight**: This is webhook-to-API orchestration, not direct integration
**Flow**: User pays → Stripe sends webhook → Verify signature → Fetch full checkout session → Check product ID → If match, call ClickMeeting API
**Non-obvious**: Product ID matching is hardcoded logic, not configuration
**Gotcha**: Must expand line items in webhook to get product details
**Trace from**: `src/app/api/clickmeeting/route.ts:35`

### Form Submissions → S3
**Key Insight**: No database - direct write to S3 as JSON files
**Pattern**: Generate UUID → Write `{uuid}.json` with data + timestamp → Return success
**Why**: Simple, no database migrations, cheap, sufficient for low-volume forms
**Implication**: No search/query capability, manual processing from S3 console
**Files**: `src/app/api/subscribe/route.ts:18`, `src/app/api/vacancies/apply/route.ts:22`

### Authentication vs Authorization Split
**Key Insight**: Two separate services handle auth concerns
**Flow**: Clerk verifies identity → Google Workspace determines permissions
**Why**: Clerk for easy auth, Google Workspace for existing org structure
**Non-obvious**: Role is fetched on-demand, not cached in session (performance consideration)
**Trace from**: `src/lib/google-directory.ts:45`

## Cache Strategy Insights

### Tag-Based Revalidation
**Content Type** → **Cache Tag** → **What Regenerates**
- `event` → All event listing + detail pages
- `news` → All news listing + detail pages
- `guide` → All guide pages
- `vacancy` → All vacancy pages
- `feedback` → Homepage (testimonials section)

**Key Insight**: One document publish triggers regeneration of entire content type
**Trade-off**: Simpler webhook logic vs. more regeneration than necessary
**Acceptable because**: Content types have <100 documents each, regeneration is fast

### Force-Cache Strategy
**Decision**: All Sanity fetches use `force-cache`, not `no-cache` or time-based revalidation
**Why**: Aggressive caching for performance, webhook-based invalidation for freshness
**Gotcha**: If webhooks break, content becomes stale indefinitely
**Implementation**: Check any `src/sanity/*/service.ts` for `next: { tags: [...] }`

## Data Transformation Patterns

### Portable Text → HTML
**When**: Server-side during Sanity query processing
**Why**: Not in component (separates concerns), not in CMS (keeps content structured)
**Library**: `@portabletext/to-html` with default serializers
**Implication**: Adding custom blocks requires serializer updates
**Example**: `src/sanity/news/service.ts:28`

### Slug Generation
**When**: In Sanity Studio on title change
**Source**: Belarusian text (`localeString.be`), not Dutch
**Why**: Belarusian is primary language, ensures consistent slugs across locales
**Implication**: Slug doesn't reflect Dutch title, but URL consistency is more important
**Config**: Sanity schema definitions

## Security Patterns

### Webhook Signature Verification
**Critical**: Every webhook endpoint must verify signature before processing
**Methods**:
- Sanity: HMAC-SHA256 manual verification (`src/app/api/revalidate/route.ts:15`)
- Stripe: Stripe SDK (`stripe.webhooks.constructEvent`)
- Clerk: Svix library (`svix.verify()`)

**Gotcha**: Different verification methods per service - check docs carefully
**Never**: Process webhook without verification (security vulnerability)

### Input Validation
**Pattern**: Zod schemas in `/src/contract/`, not inline validation
**Why**: Reusable, type-safe, clear error messages
**Implication**: API route changes require contract updates
**Example**: `src/contract/donate.ts:8`

## Monitoring Insights

**Current State**: Minimal structured monitoring
**What exists**:
- Vercel Speed Insights (automatic)
- Umami page views (script tag)
- Service-level monitoring (Stripe/Clerk/Sanity dashboards)

**What's missing**:
- Structured error logging
- API route performance metrics
- Webhook failure alerts
- Cache hit/miss rates

**Implication**: Debugging requires checking multiple service dashboards

## Troubleshooting Entry Points

### Content Not Updating
1. Sanity Dashboard → API → Webhooks → Check delivery logs
2. Vercel logs → Search for `/api/revalidate`
3. Verify `SANITY_REVALIDATE_SECRET` matches between services

### Payment Flow Broken
1. Stripe Dashboard → Developers → Webhooks → Check delivery
2. Vercel logs → Search for `/api/clickmeeting`
3. Check product ID in code matches Stripe product

### Auth Issues
1. Clerk Dashboard → Users → Verify user exists
2. Google Workspace Admin → Groups → Check membership
3. Verify service account credentials and scopes

## Flow Tracing Tips

**To trace a feature**:
1. Start with route: `src/app/[lang]/[route]/page.tsx`
2. Follow imports to Sanity services or API calls
3. Check validation in `src/contract/` if API involved
4. Trace external integrations in `src/lib/`
5. Check middleware for routing logic

**Use Grep to find**:
- API calls: `fetch(`
- Sanity queries: `sanityFetch` or GROQ strings
- Cache tags: `tags:` or `revalidateTag`
- Webhooks: `signature` or service names

## Performance Considerations

**Static Generation**: All pages pre-rendered at build
**ISR**: Content updates within minutes (webhook latency)
**Database**: None - all content in Sanity, forms in S3
**Serverless**: API routes have 10s timeout (Vercel Hobby plan)

**Implication**: Keep API routes fast, avoid long-running operations
