# Data Flows Quick Reference

> **Purpose**: Shows how data moves through the system. Look here to understand request flows and find entry points.

## Core Flows

### 1. Page Rendering (ISR)
```
Request → /src/middleware.ts (locale check)
       → Next.js Router ([lang] param)
       → /src/app/[lang]/layout.tsx (Clerk, i18n, header/footer)
       → page.tsx (e.g., /src/app/[lang]/events/page.tsx)
           → /src/sanity/event/service.ts (GROQ query with cache tags)
           → force-cache + ISR
       → Static HTML
```
**Key files**: `/src/middleware.ts`, page components, `/src/sanity/*/service.ts`

### 2. Content Updates (Webhooks → ISR)
```
Sanity Studio edit/publish
    → Webhook: POST /api/revalidate
    → /src/app/api/revalidate/route.ts
        - Verify HMAC signature
        - Extract _type → cache tag
        - revalidateTag(contentType)
    → Next.js regenerates affected pages
```
**Key files**: `/src/app/api/revalidate/route.ts`
**Config**: Sanity dashboard → Webhooks

### 3. Donation Flow
```
/[lang]/donate form
    → GET /api/donate/link?amount=X&recurring=true
    → /src/app/api/donate/link/route.ts
        - /src/lib/stripe.ts (create/find product, price, payment link)
    → Redirect to Stripe
    → User pays
    → Stripe webhook: POST /api/clickmeeting
    → /src/app/api/clickmeeting/route.ts
        - Verify signature
        - Check product ID
        - /src/lib/clickmeeting.ts (send invite if match)
```
**Key files**: `/src/app/api/donate/link/route.ts`, `/src/app/api/clickmeeting/route.ts`, `/src/lib/stripe.ts`, `/src/lib/clickmeeting.ts`

### 4. Form Submissions → S3
```
Subscription form: /[lang]/ → POST /api/subscribe → /src/lib/s3.ts → Save {uuid}.json
Applications form: /[lang]/vacancies/[id] → POST /api/vacancies/apply → /src/lib/s3.ts → Save {id}/{uuid}.json
```
**Key files**: `/src/app/api/subscribe/route.ts`, `/src/app/api/vacancies/apply/route.ts`, `/src/lib/s3.ts`
**Validation**: `/src/contract/*.ts` (Zod schemas)

### 5. Authentication & Authorization
```
Protected page access
    → Clerk middleware checks session
    → /src/lib/google-directory.ts (fetch user's Google Groups)
    → Map groups to role: Admin (administratie@) > Editor (editors@) > Member
    → Component renders based on role
```
**Key files**: `/src/lib/google-directory.ts`, `/src/app/[lang]/layout.tsx` (ClerkProvider)

### 6. User Lifecycle (Clerk Webhooks)
```
User event (created/updated/deleted)
    → POST /api/webhooks/clerk
    → /src/app/api/webhooks/clerk/route.ts
        - Verify Svix signature
        - Process event (currently minimal)
```
**Key files**: `/src/app/api/webhooks/clerk/route.ts`

## Data Transformations

### Multi-language Content
```
Sanity localeString: { be: "...", nl: "..." }
    → GROQ query projection: localeString[lang] as "title"
    → TypeScript type: { title: string }
    → Component renders single language
```
**Where**: All `/src/sanity/*/service.ts` files

### Portable Text → HTML
```
Sanity Portable Text blocks
    → @portabletext/to-html conversion
    → HTML string
    → dangerouslySetInnerHTML in component
```
**Where**: `/src/sanity/*/service.ts` functions

### Slug Generation
```
Editor enters title (localeString.be)
    → Sanity auto-generates slug
    → lowercase + hyphens + unique check
    → Used in /[lang]/[type]/[slug] routes
```
**Where**: Sanity Studio field configuration

## Cache Strategy

### Cache Tags (ISR)
| Content Type | Tag | Routes Affected |
|--------------|-----|-----------------|
| Event | `event` | `/[lang]/events/*` |
| News | `news` | `/[lang]/news/*` |
| Guide | `guide` | `/[lang]/guides/*` |
| Vacancy | `vacancy` | `/[lang]/vacancies/*` |
| Feedback | `feedback` | `/[lang]/` (homepage) |

**Implementation**: Add to fetch options in `/src/sanity/*/service.ts`:
```typescript
next: { tags: ['event'] }
```

### Revalidation
- **Trigger**: Sanity webhook on publish/update/delete
- **Granularity**: By content type (not per document)
- **Files**: `/src/app/api/revalidate/route.ts`

## External Service Patterns

### Stripe
**Create flow**: Search existing → Create if missing (products, prices, payment links)
**Webhook flow**: Verify signature → Fetch full data → Process event
**Where**: `/src/lib/stripe.ts`

### S3
**Pattern**: Upload JSON with random UUID filename
**Structure**:
- Subscriptions: `{uuid}.json`
- Applications: `{vacancy-id}/{uuid}.json`
**Where**: `/src/lib/s3.ts`

### Google Workspace
**Pattern**: Service account JWT → Impersonate admin → Fetch user groups → Map to role
**Caching**: None (consider adding session cache)
**Where**: `/src/lib/google-directory.ts`

### ClickMeeting
**Pattern**: Triggered by Stripe webhook → Send invitation to email
**Idempotency**: Handled by ClickMeeting (duplicate emails OK)
**Where**: `/src/lib/clickmeeting.ts`

## Error Handling

### API Routes
Standard format:
```typescript
// Success
{ success: true, data: {...} }

// Error
{ error: "message" }  // with appropriate HTTP status
```

### Webhooks
- Return 401 if signature invalid (triggers retry)
- Return 500 if processing fails (triggers retry)
- Return 200 for success (idempotent)

### Sanity Queries
- Throw error if query fails
- Page shows 404 or error boundary
- No graceful degradation currently

## Security Patterns

### Webhook Verification
| Service | Method | File |
|---------|--------|------|
| Sanity | HMAC-SHA256 | `/src/app/api/revalidate/route.ts` |
| Stripe | Stripe SDK | `/src/app/api/clickmeeting/route.ts` |
| Clerk | Svix library | `/src/app/api/webhooks/clerk/route.ts` |

**Secrets**: All in environment variables, verified on every webhook

### Input Validation
- **API routes**: Zod schemas in `/src/contract/`
- **Forms**: Client-side + server-side validation
- **Sanity**: Schema validation in CMS

## Monitoring Entry Points

**Performance**: Vercel Speed Insights (automatic)
**Analytics**: Umami script in `/src/app/layout.tsx`
**Errors**: Not structured (consider adding Sentry)

**What to monitor**:
- Webhook delivery failures (in service dashboards)
- ISR revalidation success (Next.js logs)
- API route errors (server logs)
- Build failures (GitHub Actions)

## Common Issues & Where to Look

**Content not updating**:
1. Check Sanity webhook logs (Sanity dashboard)
2. Check `/api/revalidate` in Vercel logs
3. Verify `SANITY_REVALIDATE_SECRET` matches

**Payment flow broken**:
1. Check Stripe webhook logs (Stripe dashboard)
2. Check `/api/clickmeeting` in Vercel logs
3. Verify product IDs match

**Auth not working**:
1. Check Clerk dashboard for user
2. Check Google Workspace for group membership
3. Verify service account credentials

**Form submissions failing**:
1. Check S3 bucket permissions
2. Verify AWS credentials
3. Check API route logs

## Flow Tracing Tips

To trace a specific feature:
1. **Find the entry point**: Start with route in `/src/app/[lang]/`
2. **Follow the service calls**: Check imports for `/src/sanity/` or `/src/lib/`
3. **Check API routes**: Look in `/src/app/api/` for backend logic
4. **Find validation**: Check `/src/contract/` for Zod schemas
5. **Trace webhooks**: Follow from external service → API route → processing logic

Use Grep or file search to find:
- API calls: Search for `fetch(` or service function names
- Webhooks: Search for `webhook` or service names
- Cache tags: Search for `revalidateTag` or `next: { tags:`
- Translations: Search for `useTranslation` or `t(` calls
