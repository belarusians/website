# Integration Insights

> **Purpose**: Critical information about external services. Read their docs and the code - this shows you gotchas and environment setup.

## Integration Overview

| Service | Purpose | Code Location | Critical Gotcha |
|---------|---------|---------------|-----------------|
| Sanity | Content management | `src/sanity/` | GROQ locale projection required |
| Clerk | User authentication | Layout, webhooks | Must include `[lang]` in redirect URLs |
| Stripe | Payments | `src/lib/stripe.ts` | Product ID matching hardcoded |
| Google Workspace | Role authorization | `src/lib/google-directory.ts` | Private key newlines must be preserved |
| AWS S3 | Form storage | `src/lib/s3.ts` | No query capability - manual processing |
| ClickMeeting | Video conferencing | `src/lib/clickmeeting.ts` | Triggered by Stripe webhook only |
| Umami | Analytics | `src/app/layout.tsx` | Script tag embed - no server-side tracking |

## Environment Variables (Required)

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_REVALIDATE_SECRET=           # For webhook verification

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/[lang]/sign-in    # Must include [lang]!
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/[lang]/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/[lang]
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/[lang]

# Stripe
STRIPE_SECRET_KEY=                  # Use sk_test_ for dev, sk_live_ for prod
STRIPE_WEBHOOK_SECRET=              # Different per environment

# Google Workspace (RBAC)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=                 # CRITICAL: Preserve \n as actual newlines
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

# Umami Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_URL=
```

## Critical Integration Gotchas

### Sanity CMS
**Gotcha #1**: GROQ queries must extract locale, not return entire localeString object
- ❌ Wrong: `localeString` → returns `{ be: "...", nl: "..." }`
- ✅ Correct: `localeString[lang] as "title"` → returns string

**Gotcha #2**: Webhook signature verification uses HMAC-SHA256, not Svix
- Check: `src/app/api/revalidate/route.ts:15`

**Gotcha #3**: Revalidation is type-level, publishing one event regenerates all events
- Trade-off accepted for simplicity

### Clerk
**Gotcha #1**: All redirect URLs must include `[lang]` parameter
- ❌ Wrong: `/sign-in`
- ✅ Correct: `/[lang]/sign-in`

**Gotcha #2**: Webhooks use Svix for signature verification (different from Stripe/Sanity)

### Stripe
**Gotcha #1**: Product ID matching is hardcoded in webhook handler
- Check: `src/app/api/clickmeeting/route.ts:35`
- Must update code when creating new event products

**Gotcha #2**: Must expand line items in checkout session to get product details
- `expand: ['line_items.data.price.product']`

**Gotcha #3**: Different webhook secrets for test vs production
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/clickmeeting`

### Google Workspace
**Gotcha #1**: Private key newlines MUST be preserved
- ❌ Wrong: Literal `\n` string
- ✅ Correct: Actual newline character
- Fix: `GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')`

**Gotcha #2**: Service account needs domain-wide delegation
- Setup: Google Cloud Console → IAM → Service Accounts → Domain-wide delegation
- Required scope: `https://www.googleapis.com/auth/admin.directory.group.readonly`

**Gotcha #3**: Must impersonate admin user
- `subject: GOOGLE_SUBJECT_EMAIL` required in JWT auth

### AWS S3
**Gotcha #1**: No database means no query/search capability
- Implication: Manual download from S3 console for processing

**Gotcha #2**: IAM permissions must allow `s3:PutObject`
- Check bucket policy if uploads fail with 403

### ClickMeeting
**Gotcha #1**: Not directly called - only triggered by Stripe webhook
- Flow: Payment → Stripe webhook → Check product ID → Send invite

**Gotcha #2**: Product ID must match hardcoded check
- See: `src/app/api/clickmeeting/route.ts:35`

## Webhook Configuration

### Setup Checklist
| Service | Dashboard | Endpoint | Events | Signature |
|---------|-----------|----------|--------|-----------|
| Sanity | sanity.io/manage | `/api/revalidate` | publish/update/delete | HMAC-SHA256 |
| Stripe | dashboard.stripe.com/webhooks | `/api/clickmeeting` | `checkout.session.completed` | Stripe SDK |
| Clerk | dashboard.clerk.com/webhooks | `/api/webhooks/clerk` | user.* | Svix |

**All webhooks require**:
1. HTTPS URL (no localhost in production)
2. Signature verification in handler
3. 200 response on success
4. Idempotent processing (webhooks can be replayed)

## Security Insights

### Secret Management
**Critical**: All secrets in environment variables, never in code
**Per-environment**: Use different secrets for dev/staging/production
**Rotation**: Quarterly rotation recommended

### Webhook Security
**Pattern**: Every webhook verifies signature before processing
**Methods differ**: Sanity (HMAC), Stripe (SDK), Clerk (Svix)
**Never skip**: Processing unverified webhooks = security vulnerability

### Service Account Permissions
**Principle**: Least privilege
- Google Workspace: Read-only directory access
- AWS S3: PutObject only (no delete/list)
- Stripe: No admin permissions needed

## Testing Integrations Locally

### Webhooks
```bash
# Stripe webhooks
stripe listen --forward-to localhost:3000/api/clickmeeting

# Sanity/Clerk webhooks
ngrok http 3000
# Update webhook URL in dashboard to ngrok URL
```

### API Keys
- **Sanity**: Use separate dataset for dev (`development` vs `production`)
- **Clerk**: Use test environment
- **Stripe**: Use test keys (`sk_test_...`)
- **S3**: Use separate dev buckets

## Common Issues

### "Content not updating after Sanity publish"
1. Check Sanity Dashboard → API → Webhooks → Delivery logs
2. Verify `SANITY_REVALIDATE_SECRET` matches
3. Check Next.js cache tags are attached to fetches

### "Clerk redirects broken"
1. Verify all Clerk URLs include `[lang]` parameter
2. Check middleware isn't blocking Clerk routes

### "Stripe payment success but no ClickMeeting invite"
1. Check Stripe webhook delivery in dashboard
2. Verify product ID matches check in code
3. Check ClickMeeting API key and room ID

### "Google Workspace 403 errors"
1. Verify service account has domain-wide delegation
2. Check private key newlines are actual newlines, not `\n` strings
3. Verify `GOOGLE_SUBJECT_EMAIL` is admin account

### "S3 uploads failing"
1. Check IAM permissions (need `s3:PutObject`)
2. Verify bucket names and region
3. Check AWS credentials are correct

## Integration Dependencies

**Clerk depends on**: Google Workspace for role mapping
**Stripe depends on**: ClickMeeting for event invitations
**Sanity depends on**: Webhooks for ISR to work

**Implication**: Auth works without Google Workspace (default to Member role), but RBAC requires it

## Performance Considerations

**Google Workspace API**: Not cached, fetched on-demand
- Consider: Add session caching for role lookups

**Stripe API**: Only called for donations (low frequency)
- No rate limiting concerns

**S3 uploads**: Synchronous, blocks API response
- Acceptable for low-volume forms

## Related Documentation

- Read service docs for API details
- Check code in `/src/lib/` for implementations
- See `DATA_FLOWS.md` for webhook flow sequences
