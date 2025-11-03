# Data Flows

> **Purpose**: This document describes how data moves through the MARA website system. It helps AI agents understand request-response cycles, webhook flows, and data transformation patterns.

## Core Data Flows

### 1. Page Rendering Flow

```
User Request
    ↓
Middleware (/src/middleware.ts)
    ├─ Check locale prefix (be/ or nl/)
    ├─ Normalize URL (remove trailing slash, redirect /ru)
    └─ Pass to Next.js router
    ↓
App Router ([lang] parameter)
    ↓
Layout Component (/src/app/[lang]/layout.tsx)
    ├─ Initialize Clerk Provider
    ├─ Load i18n translations
    ├─ Render Header component
    └─ Render children
    ↓
Page Component (e.g., /src/app/[lang]/events/page.tsx)
    ├─ Call Sanity service (e.g., getAllEvents())
    │   ├─ Execute GROQ query
    │   ├─ Attach cache tag
    │   └─ Use force-cache strategy
    ├─ Transform Portable Text → HTML
    └─ Render components
    ↓
HTML Response (Static or ISR-cached)
```

**Key Points**:
- Server-side rendering by default
- Force-cache strategy with cache tags
- Static generation at build time
- ISR for content updates

### 2. Content Update Flow (ISR)

```
Editor in Sanity Studio
    ↓
Publishes/Updates Content
    ↓
Sanity CMS
    ↓
Triggers Webhook → POST /api/revalidate
    ├─ Headers: Content-Type, Sanity-Webhook-Signature
    ├─ Body: { _type, _id, slug, ... }
    └─ Signature: HMAC-SHA256
    ↓
API Route (/src/app/api/revalidate/route.ts)
    ├─ Verify webhook signature
    │   └─ Compare HMAC(secret, body) with header signature
    ├─ Extract content type (_type field)
    ├─ Call revalidateTag(contentType)
    └─ Call revalidatePath(route) if applicable
    ↓
Next.js Cache Invalidation
    ↓
Next Static Generation
    ├─ Re-execute page component
    ├─ Re-fetch from Sanity
    └─ Generate new HTML
    ↓
Updated Content Served to Users
```

**Security**: HMAC signature verification prevents unauthorized revalidation.

**Performance**: Only affected pages regenerated, not entire site.

### 3. Donation Flow

```
User on /[lang]/donate Page
    ↓
Fills Donation Form
    ├─ Amount (EUR)
    └─ Recurring (true/false)
    ↓
Client-side Fetch → GET /api/donate/link
    ├─ Query params: ?amount=50&recurring=true
    └─ Headers: none required (public endpoint)
    ↓
API Route (/src/app/api/donate/link/route.ts)
    ├─ Validate query params with Zod schema
    ├─ Initialize Stripe client
    ├─ Search for existing product by name
    │   ├─ If found: Use existing product ID
    │   └─ If not found: Create new product
    ├─ Search for existing price
    │   ├─ Match: amount, currency (EUR), recurring interval
    │   └─ If not found: Create new price
    ├─ Create Payment Link
    │   ├─ Link to price ID
    │   ├─ Allow promotion codes
    │   └─ Set success URL
    └─ Return payment link URL
    ↓
Client Redirects to Stripe Payment Link
    ↓
User Completes Payment on Stripe
    ↓
Stripe Sends Webhook → POST /api/clickmeeting
    ├─ Event: checkout.session.completed
    ├─ Headers: Stripe-Signature
    └─ Body: { data: { object: { id, customer, ... } } }
    ↓
API Route (/src/app/api/clickmeeting/route.ts)
    ├─ Verify webhook signature
    ├─ Extract checkout session ID
    ├─ Fetch full session from Stripe API
    │   └─ Expand: line_items.data.price.product
    ├─ Extract product ID from line items
    ├─ Check if product matches ClickMeeting event
    │   └─ If match: Extract customer email
    └─ Send ClickMeeting invitation
        ├─ API: POST clickmeeting.com/v1/conferences/{room_id}/invitations
        └─ Body: { email, role: "attendee" }
    ↓
User Receives ClickMeeting Invitation Email
```

**Decision Points**:
- Product matching determines if ClickMeeting invite sent
- Webhook signature verification prevents fraud
- Idempotency handled by Stripe event IDs

### 4. Email Subscription Flow

```
User on /[lang]/ Page (Homepage)
    ↓
Fills Subscription Form
    └─ Email address
    ↓
Client-side Fetch → POST /api/subscribe
    ├─ Headers: Content-Type: application/json
    └─ Body: { email: "user@example.com" }
    ↓
API Route (/src/app/api/subscribe/route.ts)
    ├─ Validate email format
    ├─ Initialize AWS S3 client
    └─ Upload to S3
        ├─ Bucket: SUBSCRIPTIONS_BUCKET
        ├─ Key: random-uuid.json
        ├─ Body: { email, subscribedAt: ISO timestamp }
        └─ ContentType: application/json
    ↓
Return Success Response
    ↓
Client Shows Confirmation Message
```

**Storage Strategy**: S3 chosen for simplicity (no database needed).

**File Format**: JSON with email and timestamp for future processing.

### 5. Vacancy Application Flow

```
User on /[lang]/vacancies/[id] Page
    ↓
Fills Application Form
    ├─ Contact info (name, email, phone)
    └─ Additional info (cover letter, etc.)
    ↓
Client-side Fetch → POST /api/vacancies/apply
    ├─ Headers: Content-Type: application/json
    └─ Body: { contact: {...}, additionalInfo: "...", id: "vacancy-id" }
    ↓
API Route (/src/app/api/vacancies/apply/route.ts)
    ├─ Validate request body with Zod schema
    │   └─ Check required fields, email format, etc.
    ├─ Initialize AWS S3 client
    └─ Upload to S3
        ├─ Bucket: APPLICATIONS_BUCKET
        ├─ Key: {vacancy-id}/random-uuid.json
        ├─ Body: { ...contact, additionalInfo, appliedAt: ISO timestamp }
        └─ ContentType: application/json
    ↓
Return Success Response
    ↓
Client Shows Confirmation Message
```

**File Organization**: Applications organized by vacancy ID in S3.

**Manual Processing**: HR team downloads applications from S3 console.

### 6. User Authentication & Authorization Flow

```
User Visits Protected Page
    ↓
Clerk Middleware Checks Session
    ├─ No session? Redirect to /[lang]/sign-in
    └─ Valid session? Continue
    ↓
Page Component Needs User Role
    ↓
Call getUserRole() (/src/lib/google-directory.ts)
    ├─ Get user email from Clerk session
    ├─ Initialize Google Workspace API client
    │   ├─ Service account credentials from env
    │   ├─ Subject: admin@belarusians.nl
    │   └─ Scopes: directory.googleapis.com/auth/admin.directory.group.readonly
    ├─ Fetch user's group memberships
    │   └─ API: GET /admin/directory/v1/groups?userKey={email}
    ├─ Check group membership
    │   ├─ administratie@belarusians.nl → Role: Admin
    │   ├─ editors@belarusians.nl → Role: Editor
    │   └─ Default → Role: Member
    └─ Return role
    ↓
Component Renders Based on Role
    ├─ Admin: Full access
    ├─ Editor: Content management
    └─ Member: Basic access
```

**Caching**: User roles could be cached in session, but currently fetched on-demand.

**Security**: Service account has read-only directory access.

### 7. Clerk Webhook Flow

```
Clerk Event (e.g., user.created)
    ↓
Clerk Sends Webhook → POST /api/webhooks/clerk
    ├─ Headers: svix-* signature headers
    └─ Body: { type: "user.created", data: {...} }
    ↓
API Route (/src/app/api/webhooks/clerk/route.ts)
    ├─ Verify webhook signature with Svix
    ├─ Extract event type and data
    └─ Process event
        ├─ user.created → Log or sync to external system
        ├─ user.updated → Update cached data if applicable
        └─ user.deleted → Clean up references
    ↓
Return 200 OK
```

**Purpose**: Sync user lifecycle events to external systems if needed.

**Current Implementation**: Webhook configured but minimal processing (logging only).

### 8. Image Optimization Flow

```
Sanity Image Reference in Content
    ↓
Page Component Receives Image Data
    ├─ Image asset ID
    ├─ Dimensions (width, height)
    └─ Metadata (alt text, etc.)
    ↓
Next.js Image Component
    ├─ Construct Sanity CDN URL
    │   └─ https://cdn.sanity.io/images/{project}/{dataset}/{asset}?{params}
    ├─ Set image optimization params
    │   ├─ Format: webp (modern browsers)
    │   ├─ Quality: 75 (default)
    │   └─ Responsive sizes
    └─ Generate srcset for responsive images
    ↓
Browser Requests Optimized Image
    ↓
Sanity CDN
    ├─ On-demand image transformation
    ├─ Cache at edge locations
    └─ Serve optimized image
```

**Performance**: Lazy loading, automatic format selection, responsive images.

**CDN**: Sanity CDN configured in `next.config.js` image domains.

## Data Transformation Patterns

### Portable Text → HTML

```
Sanity Content (Portable Text)
    ↓
Service Layer (e.g., /src/sanity/event/service.ts)
    ├─ Fetch content with GROQ query
    └─ Extract portable text blocks
    ↓
Transformation
    ├─ Use @portabletext/to-html library
    ├─ Apply custom serializers (if any)
    └─ Convert blocks to HTML string
    ↓
React Component
    ├─ Dangerously set inner HTML
    └─ Render in content area
```

**Locale Handling**: Each locale has separate portable text field, transformed independently.

### Multi-language Content Resolution

```
Sanity Document with Locale Fields
{
  localeString: {
    be: "Беларуская",
    nl: "Nederlands"
  }
}
    ↓
Service Layer Query
    ├─ Specify locale in GROQ projection
    └─ Extract: localeString[locale] as "title"
    ↓
TypeScript Type
{
  title: string  // Single language value
}
    ↓
Component Renders Localized Text
```

**Fallback**: If requested locale missing, falls back to Belarusian (primary language).

### Slug Generation

```
Editor Enters Title in Sanity Studio
    ↓
Sanity Slug Field with Auto-generation
    ├─ Source: localeString.be (primary language)
    ├─ Transformation: lowercase, spaces → hyphens, remove special chars
    └─ Uniqueness check within content type
    ↓
Generated Slug (e.g., "belaruskaya-mova")
    ↓
Used in Next.js Dynamic Routes
    └─ /[lang]/events/[slug]
```

**Uniqueness**: Sanity enforces unique slugs per content type (not globally).

## Data Persistence Layers

### 1. Sanity CMS (Primary Content)

**What's Stored**:
- Events, news, guides, vacancies, feedback
- Multi-language text and rich text
- Image references (assets stored in Sanity)
- Document metadata (publish date, author, etc.)

**Access Pattern**: GROQ queries with force-cache + ISR

**Backup**: Sanity Cloud handles backups automatically

### 2. AWS S3 (Form Submissions)

**What's Stored**:
- Email subscriptions (bucket: SUBSCRIPTIONS_BUCKET)
- Vacancy applications (bucket: APPLICATIONS_BUCKET)

**File Format**: JSON with timestamp

**Access Pattern**: Write-only from API routes, manual download by admins

**Lifecycle**: No automatic deletion (manual cleanup)

### 3. Clerk (User Sessions)

**What's Stored**:
- User accounts (email, name, profile)
- Session tokens (JWT)
- OAuth connections (if configured)

**Access Pattern**: Clerk SDK and webhooks

**Integration**: Read-only from application (no user data modification)

### 4. Google Workspace (User Roles)

**What's Stored**:
- Group memberships (administratie@, editors@)
- User directory information

**Access Pattern**: Read-only via Directory API

**Integration**: Queried on-demand for authorization decisions

### 5. Stripe (Payment Data)

**What's Stored**:
- Products (donation tiers)
- Prices (amount, currency, recurring interval)
- Payment Links (checkout URLs)
- Checkout Sessions (payment transactions)

**Access Pattern**: Create via API, webhook notifications

**Integration**: Bidirectional (create + receive webhooks)

### 6. ClickMeeting (Event Attendees)

**What's Stored**:
- Conference rooms
- Attendee invitations

**Access Pattern**: Write-only (send invitations)

**Integration**: Triggered by Stripe webhooks

## Cache Strategy

### Next.js Cache Layers

1. **Full Route Cache** (Static HTML)
   - Scope: Entire page HTML
   - Duration: Until revalidation
   - Invalidation: `revalidatePath()` or `revalidateTag()`

2. **Data Cache** (Fetch responses)
   - Scope: Individual fetch() calls
   - Duration: force-cache = indefinite
   - Invalidation: Tag-based via `revalidateTag()`

3. **Router Cache** (Client-side)
   - Scope: Route segments
   - Duration: Session or 30 seconds (dynamic)
   - Invalidation: Automatic on navigation

### Cache Tag Mapping

```typescript
Content Type → Cache Tag → Routes Affected
-------------------------------------------------
event        → "event"   → /[lang]/events, /[lang]/events/[slug]
news         → "news"    → /[lang]/news, /[lang]/news/[slug]
guide        → "guide"   → /[lang]/guides, /[lang]/guides/[slug]
vacancy      → "vacancy" → /[lang]/vacancies, /[lang]/vacancies/[id]
feedback     → "feedback"→ /[lang]/ (homepage testimonials)
```

**Granularity**: Type-level (not document-level) for simplicity.

## Error Handling Patterns

### API Route Error Responses

```typescript
// Success
{ success: true, data: {...} }

// Client Error (400)
{ error: "Invalid email format" }

// Server Error (500)
{ error: "Internal server error" }

// Validation Error (400)
{ error: "Validation failed", details: [...] }
```

**Consistency**: All API routes follow this response format.

### Webhook Error Handling

```
Webhook Received → Signature Verification Failed
    ↓
Return 401 Unauthorized
    ↓
External service will retry (exponential backoff)
```

**Idempotency**: Stripe/Clerk webhooks can be replayed safely.

### Sanity Query Error Handling

```
sanityFetch() throws error
    ↓
Catch in page component
    ↓
Return notFound() or error page
```

**Fallback**: No graceful degradation, shows error to user.

## Rate Limiting & Quotas

### External Service Limits

- **Sanity**: 50k queries/month (free tier), unlimited with paid
- **Stripe**: No rate limit on API (reasonable use)
- **Clerk**: Based on plan (10k MAU for free tier)
- **Google Workspace**: 50 queries/second/user
- **ClickMeeting**: Based on plan
- **AWS S3**: No hard limit, pay-per-use

### Application-Level Limits

**None currently implemented**. Consider adding:
- API route rate limiting (e.g., subscription endpoint)
- Webhook replay protection (event ID tracking)

## Monitoring & Observability

### What's Tracked

- **Vercel Speed Insights**: Core Web Vitals, load times
- **Umami Analytics**: Page views, user sessions, events
- **Stripe Dashboard**: Payment metrics, conversion rates
- **Sanity Dashboard**: Content changes, webhook deliveries

### What's NOT Tracked

- API route performance metrics
- Error rates and stack traces
- S3 storage usage
- Cache hit/miss rates

**Recommendation**: Add structured logging (e.g., Pino) and APM (e.g., Sentry).

## Security Considerations

### Data in Transit

- All external API calls use HTTPS
- Webhook signatures verified (HMAC or Svix)
- Clerk sessions use secure JWT tokens

### Data at Rest

- Sanity: Encrypted by default (AES-256)
- S3: Server-side encryption available (configure in bucket settings)
- Stripe: PCI-DSS compliant

### Sensitive Data Handling

- API keys in environment variables (never committed)
- No user passwords stored (Clerk handles auth)
- Email addresses in S3 (consider GDPR compliance)

### Webhook Security

| Service | Verification Method | Secret Location |
|---------|---------------------|-----------------|
| Sanity | HMAC-SHA256 | `SANITY_REVALIDATE_SECRET` |
| Stripe | Stripe-Signature header | `STRIPE_WEBHOOK_SECRET` |
| Clerk | Svix signature | `CLERK_WEBHOOK_SECRET` |

**Best Practice**: Rotate secrets periodically, use different secrets per environment.
