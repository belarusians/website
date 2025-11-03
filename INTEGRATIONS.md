# External Integrations Quick Reference

> **Purpose**: Quick lookup for API credentials, endpoints, and code locations. See code for implementation details.

## Overview

| Service | Purpose | Code Location | Auth Type |
|---------|---------|---------------|-----------|
| Sanity CMS | Content management | `/src/sanity/` | API Token |
| Clerk | User authentication | Layout, webhooks | API Key + Webhook Secret |
| Stripe | Payment processing | `/src/lib/stripe.ts` | Secret Key + Webhook Secret |
| Google Workspace | Role authorization | `/src/lib/google-directory.ts` | Service Account JWT |
| AWS S3 | Form data storage | `/src/lib/s3.ts` | Access Key + Secret |
| ClickMeeting | Video conferencing | `/src/lib/clickmeeting.ts` | API Key |
| Umami | Website analytics | `/src/app/layout.tsx` | Public (script embed) |

## Sanity CMS

### Environment Variables
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=         # Project ID
NEXT_PUBLIC_SANITY_DATASET=            # Dataset name (production)
NEXT_PUBLIC_SANITY_API_VERSION=        # API version (2023-05-03)
SANITY_API_READ_TOKEN=                 # Read token (optional)
SANITY_REVALIDATE_SECRET=              # Webhook HMAC secret
```

### Key Locations
- **Config**: `/src/sanity/env.ts`, `/sanity.config.ts`
- **Schemas**: `/src/sanity/{type}/schema.ts`
- **Queries**: `/src/sanity/{type}/service.ts`
- **Studio**: Access at `/studio`

### Webhooks
- **Endpoint**: `POST /api/revalidate`
- **Code**: `/src/app/api/revalidate/route.ts`
- **Signature**: HMAC-SHA256 in `Sanity-Webhook-Signature` header
- **Config**: Sanity Dashboard → API → Webhooks

### Content Types
Event, News, Guide, Vacancy, Feedback (see `/src/sanity/` subdirectories)

---

## Clerk

### Environment Variables
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=     # Frontend SDK key
CLERK_SECRET_KEY=                      # Backend API key
CLERK_WEBHOOK_SECRET=                  # Svix webhook secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/[lang]/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/[lang]/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/[lang]
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/[lang]
```

### Key Locations
- **Provider**: `/src/app/[lang]/layout.tsx` (ClerkProvider)
- **Middleware**: `/src/middleware.ts` (session handling)
- **Webhooks**: `/src/app/api/webhooks/clerk/route.ts`

### Webhook Events
`user.created`, `user.updated`, `user.deleted`, `session.created`, `session.ended`

### Config
Clerk Dashboard → Webhooks → Add endpoint → Select events

---

## Stripe

### Environment Variables
```bash
STRIPE_SECRET_KEY=                     # Backend API key (sk_...)
STRIPE_WEBHOOK_SECRET=                 # Webhook signing secret (whsec_...)
```

### Key Locations
- **Client**: `/src/lib/stripe.ts`
- **Donation API**: `/src/app/api/donate/link/route.ts`
- **Webhook Handler**: `/src/app/api/clickmeeting/route.ts`

### API Operations
- **Products**: Search by name, create if missing
- **Prices**: Search by amount/currency/interval, create if missing
- **Payment Links**: Create with line items
- **Webhooks**: `checkout.session.completed` → ClickMeeting invite

### Config
Stripe Dashboard → Developers → Webhooks → Add endpoint → Select `checkout.session.completed`

---

## Google Workspace

### Environment Variables
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=          # Service account email
GOOGLE_PRIVATE_KEY=                    # Private key (preserve \n)
GOOGLE_SUBJECT_EMAIL=                  # Admin email to impersonate
```

### Key Locations
- **Client**: `/src/lib/google-directory.ts`
- **Usage**: Authorization checks in components

### Setup Requirements
1. Create service account in Google Cloud Console
2. Enable Admin SDK API
3. Grant domain-wide delegation
4. Scope: `https://www.googleapis.com/auth/admin.directory.group.readonly`

### Role Mapping
- `administratie@belarusians.nl` → Admin
- `editors@belarusians.nl` → Editor
- Default → Member

---

## AWS S3

### Environment Variables
```bash
AWS_ACCESS_KEY_ID=                     # IAM user access key
AWS_SECRET_ACCESS_KEY=                 # IAM user secret
AWS_REGION=                            # e.g., eu-central-1
SUBSCRIPTIONS_BUCKET=                  # Bucket for email subscriptions
APPLICATIONS_BUCKET=                   # Bucket for job applications
```

### Key Locations
- **Client**: `/src/lib/s3.ts`
- **Subscribe API**: `/src/app/api/subscribe/route.ts`
- **Applications API**: `/src/app/api/vacancies/apply/route.ts`

### File Structure
- Subscriptions: `{uuid}.json`
- Applications: `{vacancy-id}/{uuid}.json`

### IAM Permissions
Required: `s3:PutObject` on specified buckets

---

## ClickMeeting

### Environment Variables
```bash
CLICKMEETING_API_KEY=                  # API key from dashboard
CLICKMEETING_ROOM_ID=                  # Conference room ID
```

### Key Locations
- **Client**: `/src/lib/clickmeeting.ts`
- **Usage**: `/src/app/api/clickmeeting/route.ts` (Stripe webhook handler)

### API Endpoint
`POST https://api.clickmeeting.com/v1/conferences/{room_id}/invitations`

### Flow
Stripe payment → Webhook → Check product ID → Send email invitation

---

## Umami Analytics

### Environment Variables
```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=          # Website ID from Umami
NEXT_PUBLIC_UMAMI_URL=                 # Umami instance URL
```

### Key Locations
- **Script**: `/src/app/layout.tsx` (script tag in head)

### Features
- Automatic page view tracking
- Privacy-friendly (no cookies, GDPR compliant)
- Custom events: `window.umami.track(event, data)` (not currently used)

---

## Vercel (Hosting)

### Configuration
- **Build Command**: `npm run build`
- **Install Command**: `npm install --legacy-peer-deps`
- **Framework**: Next.js (auto-detected)
- **Environment Variables**: Set in Vercel Dashboard

### Features Used
- Automatic deployments (push to branch)
- Serverless API routes
- ISR support
- Speed Insights

### Limits (Hobby Plan)
- Function timeout: 10 seconds
- Function memory: 1024 MB
- Payload size: 5 MB

---

## Environment Variable Checklist

Copy to `.env.development` or `.env.production`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/[lang]/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/[lang]/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/[lang]
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/[lang]

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Google Workspace
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SUBJECT_EMAIL=admin@belarusians.nl

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=eu-central-1
SUBSCRIPTIONS_BUCKET=
APPLICATIONS_BUCKET=

# ClickMeeting
CLICKMEETING_API_KEY=
CLICKMEETING_ROOM_ID=

# Umami
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_URL=
```

---

## Webhook Configuration Summary

| Service | Dashboard URL | Endpoint | Events |
|---------|---------------|----------|--------|
| Sanity | sanity.io/manage | `/api/revalidate` | Document publish/update/delete |
| Stripe | dashboard.stripe.com/webhooks | `/api/clickmeeting` | `checkout.session.completed` |
| Clerk | dashboard.clerk.com/webhooks | `/api/webhooks/clerk` | User lifecycle events |

**All webhooks require**:
- HTTPS URL
- Signature verification
- Idempotent processing
- 200 response on success

---

## Testing Integrations

### Local Testing
- **Sanity**: Use production/staging dataset, test webhook with ngrok
- **Clerk**: Use test environment, test webhooks with Clerk CLI
- **Stripe**: Use test mode keys (`sk_test_...`), test webhooks with Stripe CLI
- **Google Workspace**: Use staging credentials if available
- **S3**: Use separate dev buckets
- **ClickMeeting**: Use test room if available

### CLI Tools
- Stripe CLI: `stripe listen --forward-to localhost:3000/api/clickmeeting`
- Clerk CLI: Similar webhook forwarding
- ngrok: `ngrok http 3000` for local webhook testing

---

## Common Issues

### Sanity
- **Webhooks not delivering**: Check URL, verify HTTPS, check signature secret
- **Content not updating**: Verify webhook reaching `/api/revalidate`, check cache tags

### Clerk
- **Auth not working**: Check publishable/secret keys match environment
- **Redirects failing**: Ensure sign-in/sign-up URLs include `[lang]` param

### Stripe
- **Payment links failing**: Check product/price creation logic in `/src/lib/stripe.ts`
- **Webhooks failing**: Verify signature secret, check Stripe dashboard logs

### Google Workspace
- **403 errors**: Verify domain-wide delegation, check scopes
- **Private key errors**: Ensure newlines preserved (`\n` in string)

### S3
- **Upload failures**: Check IAM permissions, bucket names, region
- **403 errors**: Verify access key/secret, check bucket policy

### ClickMeeting
- **Invites not sending**: Check API key, room ID, email format
- **Product ID mismatch**: Ensure Stripe product ID matches check logic

---

## Security Checklist

✓ All secrets in environment variables (never committed)
✓ Webhook signatures verified on every request
✓ Use test keys in development, production keys in production only
✓ Rotate secrets quarterly
✓ Service account has minimal required permissions
✓ S3 buckets are private (no public access)
✓ API routes validate inputs with Zod
✓ HTTPS enforced for all webhooks

---

## Quick Command Reference

```bash
# Test Sanity connection
npm run sanity:check

# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/api/clickmeeting

# Check environment variables
cat .env.development

# Test build with all integrations
npm run build

# Verify TypeScript types
npm run typecheck
```

---

For implementation details, see the code files listed above. All integration logic is in `/src/lib/` and API routes in `/src/app/api/`.
