# External Integrations

> **Purpose**: This document details all external service integrations, authentication methods, API contracts, and configuration requirements. It helps AI agents understand how to work with each integration.

## Integration Overview

| Service | Purpose | Direction | Auth Method | Code Location |
|---------|---------|-----------|-------------|---------------|
| Sanity CMS | Content management | Bidirectional | API Token | `/src/sanity/` |
| Clerk | User authentication | Inbound webhooks | API Key + Webhook Secret | `/src/app/api/webhooks/clerk/` |
| Stripe | Payment processing | Bidirectional + Webhooks | Secret Key + Webhook Secret | `/src/lib/stripe.ts`, `/src/app/api/clickmeeting/` |
| Google Workspace | User role authorization | Outbound API calls | Service Account JWT | `/src/lib/google-directory.ts` |
| AWS S3 | File storage | Outbound API calls | Access Key + Secret | `/src/lib/s3.ts` |
| ClickMeeting | Video conferencing | Outbound API calls | API Key | `/src/lib/clickmeeting.ts` |
| Umami | Website analytics | Script embed | Public endpoint | `/src/app/layout.tsx` |
| Vercel | Hosting & deployment | N/A (platform) | N/A | N/A |

## 1. Sanity CMS Integration

### Purpose
Headless CMS for managing events, news, guides, vacancies, and feedback.

### Configuration

**Environment Variables**:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_READ_TOKEN=secret-token
SANITY_REVALIDATE_SECRET=webhook-secret
```

**Code Location**: `/src/sanity/env.ts`

### API Integration

**Client Initialization**:
- SDK: `@sanity/client`
- Configuration: project ID, dataset, API version
- Token: Read token for private content (if any)

**Query Language**: GROQ (Graph-Relational Object Queries)

**Example GROQ Query**:
```groq
*[_type == "event" && localeString.be != null] | order(dateFrom desc) {
  _id,
  "slug": slug.current,
  "title": localeString[lang],
  "content": localeContent[lang],
  dateFrom,
  dateTo,
  location,
  ticketsLink,
  tipsLink,
  status
}
```

### Content Schemas

Defined in `/src/sanity/*/schema.ts`:
- **Event**: Dates, location, links, status, multi-language content
- **News**: Publication date, multi-language title/excerpt/content
- **Guide**: Multi-language title/excerpt/content
- **Vacancy**: Job details, task descriptions, multi-language content
- **Feedback**: Testimonials with author info

### Custom Field Types

**localeString** (`/src/sanity/locale-schemas/string.ts`):
```typescript
{
  type: 'object',
  fields: [
    { name: 'be', type: 'string', title: 'Belarusian' },
    { name: 'nl', type: 'string', title: 'Dutch' }
  ]
}
```

**localeContent** (`/src/sanity/locale-schemas/content.ts`):
```typescript
{
  type: 'object',
  fields: [
    { name: 'be', type: 'array', of: [{ type: 'block' }] },
    { name: 'nl', type: 'array', of: [{ type: 'block' }] }
  ]
}
```

### Webhooks

**Endpoint**: `POST https://belarusians.nl/api/revalidate`

**Trigger Events**:
- Document published
- Document updated
- Document deleted

**Payload**:
```json
{
  "_type": "event",
  "_id": "abc123",
  "slug": { "current": "example-event" },
  "localeString": { "be": "...", "nl": "..." }
}
```

**Security**:
- HMAC-SHA256 signature in `Sanity-Webhook-Signature` header
- Verified against `SANITY_REVALIDATE_SECRET`

**Configuration**: Set up in Sanity project settings → API → Webhooks

### Sanity Studio

**Access**: `https://belarusians.nl/studio`

**Configuration**: `/sanity.config.ts`

**Plugins**:
- `@sanity/vision` - GROQ query testing
- `@sanity-typed/types` - TypeScript type generation
- `@sanity/locale-be-by` - Belarusian locale support

**Authentication**: Handled by Sanity (separate from Clerk)

### Best Practices for AI Agents

1. **Always use GROQ projections**: Fetch only needed fields to reduce payload size
2. **Attach cache tags**: Use `next: { tags: ['event'] }` in fetch options
3. **Validate schemas**: Run `npm run sanity:check` after schema changes
4. **Test queries in Studio**: Use Vision plugin before implementing in code
5. **Handle missing locales**: Fall back to Belarusian if requested locale missing

---

## 2. Clerk Integration

### Purpose
User authentication and session management.

### Configuration

**Environment Variables**:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/[lang]/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/[lang]/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/[lang]
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/[lang]
CLERK_WEBHOOK_SECRET=whsec_xxx
```

### SDK Integration

**Provider Setup**: `/src/app/[lang]/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs'

<ClerkProvider locale={lang}>
  {children}
</ClerkProvider>
```

**Middleware Integration**: `/src/middleware.ts`

Clerk middleware handles:
- Session validation
- Protected route enforcement
- Token refresh

### User Object

**Available Data**:
```typescript
{
  id: string
  emailAddresses: { emailAddress: string }[]
  firstName: string
  lastName: string
  imageUrl: string
  createdAt: Date
}
```

### Webhooks

**Endpoint**: `POST https://belarusians.nl/api/webhooks/clerk`

**Supported Events**:
- `user.created` - New user registration
- `user.updated` - Profile changes
- `user.deleted` - Account deletion
- `session.created` - User sign-in
- `session.ended` - User sign-out

**Payload Example**:
```json
{
  "type": "user.created",
  "data": {
    "id": "user_xxx",
    "email_addresses": [{ "email_address": "user@example.com" }],
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Security**:
- Svix signature verification
- Uses `@clerk/webhook` package for validation

**Configuration**: Clerk Dashboard → Webhooks → Add endpoint

### Server-Side Usage

```typescript
import { auth } from '@clerk/nextjs'

const { userId } = auth()
if (!userId) {
  return redirect('/sign-in')
}
```

### Client-Side Usage

```typescript
import { useUser } from '@clerk/nextjs'

const { user, isLoaded } = useUser()
```

### Custom Styling

Clerk components use Tailwind classes (configured in ClerkProvider).

### Best Practices for AI Agents

1. **Check `isLoaded`**: Always wait for user data to load before rendering
2. **Use server components**: Prefer `auth()` over client-side hooks when possible
3. **Handle redirects**: Set proper return URLs after auth actions
4. **Locale-aware URLs**: Include `[lang]` in all auth redirect URLs
5. **Test webhooks locally**: Use Clerk Dashboard webhook logs for debugging

---

## 3. Stripe Integration

### Purpose
Payment processing for donations and event tickets.

### Configuration

**Environment Variables**:
```bash
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx (if using Stripe.js)
```

### SDK Integration

**Client Initialization**: `/src/lib/stripe.ts`

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})
```

### API Operations

**1. Create/Get Product**:
```typescript
// Search existing
const products = await stripe.products.search({
  query: `name:'${productName}'`
})

// Create new
const product = await stripe.products.create({
  name: productName,
  description: 'Donation to MARA'
})
```

**2. Create/Get Price**:
```typescript
// Search existing
const prices = await stripe.prices.list({
  product: product.id,
  currency: 'eur'
})

// Create new
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: amount * 100, // Convert EUR to cents
  currency: 'eur',
  recurring: recurring ? { interval: 'month' } : undefined
})
```

**3. Create Payment Link**:
```typescript
const paymentLink = await stripe.paymentLinks.create({
  line_items: [{
    price: price.id,
    quantity: 1
  }],
  allow_promotion_codes: true,
  after_completion: {
    type: 'redirect',
    redirect: { url: successUrl }
  }
})
```

### Webhooks

**Endpoint**: `POST https://belarusians.nl/api/clickmeeting`

**Supported Events**:
- `checkout.session.completed` - Successful payment

**Payload Example**:
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_xxx",
      "customer": "cus_xxx",
      "customer_email": "user@example.com",
      "line_items": {
        "data": [{
          "price": {
            "id": "price_xxx",
            "product": "prod_xxx"
          }
        }]
      }
    }
  }
}
```

**Security**:
- Stripe signature verification using `stripe.webhooks.constructEvent()`
- Uses `STRIPE_WEBHOOK_SECRET` from environment

**Configuration**: Stripe Dashboard → Developers → Webhooks → Add endpoint

### Webhook Processing Flow

1. Receive webhook POST request
2. Verify signature
3. Extract checkout session ID
4. Expand session with line items and product details
5. Check product ID against event configuration
6. If match, extract customer email and send ClickMeeting invite

### Error Handling

- **Payment failures**: Handled by Stripe (not in application)
- **Webhook failures**: Return non-200 status, Stripe retries
- **API errors**: Catch and log, return error response to client

### Best Practices for AI Agents

1. **Use idempotency keys**: For create operations to prevent duplicates
2. **Expand nested objects**: Use `expand` parameter to reduce API calls
3. **Test mode**: Use test API keys in development
4. **Webhook testing**: Use Stripe CLI for local webhook testing
5. **Error codes**: Check `err.code` for specific Stripe error types
6. **Currency**: Always use `eur` (hardcoded for this organization)

---

## 4. Google Workspace Integration

### Purpose
Fetch user roles based on Google Group memberships for authorization.

### Configuration

**Environment Variables**:
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
GOOGLE_SUBJECT_EMAIL=admin@belarusians.nl
```

**Note**: `GOOGLE_PRIVATE_KEY` must preserve newlines (use `\n` in `.env` file).

### Service Account Setup

**Required Steps**:
1. Create service account in Google Cloud Console
2. Enable Google Workspace Admin SDK API
3. Download service account key (JSON)
4. Add service account email to Google Workspace with domain-wide delegation
5. Grant scopes: `https://www.googleapis.com/auth/admin.directory.group.readonly`

**Code Location**: `/src/lib/google-directory.ts`

### API Integration

**Client Initialization**:
```typescript
import { google } from 'googleapis'

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/admin.directory.group.readonly'],
  subject: process.env.GOOGLE_SUBJECT_EMAIL // Impersonate admin
})

const directory = google.admin({ version: 'directory_v1', auth })
```

### API Operations

**Fetch User Groups**:
```typescript
const response = await directory.groups.list({
  userKey: userEmail
})

const groups = response.data.groups || []
```

### Role Mapping

```typescript
function mapGroupsToRole(groups: { email: string }[]): Role {
  const groupEmails = groups.map(g => g.email)

  if (groupEmails.includes('administratie@belarusians.nl')) {
    return 'Admin'
  }
  if (groupEmails.includes('editors@belarusians.nl')) {
    return 'Editor'
  }
  return 'Member'
}
```

**Role Hierarchy**:
- **Admin**: Full access (administratie@belarusians.nl)
- **Editor**: Content management (editors@belarusians.nl)
- **Member**: Basic access (default)

### Rate Limits

- 50 queries per second per user
- 1,500 queries per 100 seconds per user

**Recommendation**: Implement caching if role checks become frequent.

### Error Handling

- **Authentication errors**: Check service account key format
- **Authorization errors**: Verify domain-wide delegation and scopes
- **User not found**: Return default role (Member)

### Best Practices for AI Agents

1. **Cache role results**: Store in session or short-lived cache
2. **Handle missing env vars**: Gracefully degrade to Member role
3. **Test with multiple users**: Verify role mapping for each group
4. **Impersonate admin**: Always set `subject` to admin email
5. **Newline handling**: Ensure `GOOGLE_PRIVATE_KEY` newlines are correct

---

## 5. AWS S3 Integration

### Purpose
Store email subscriptions and vacancy applications.

### Configuration

**Environment Variables**:
```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=secret-key
AWS_REGION=eu-central-1
SUBSCRIPTIONS_BUCKET=mara-subscriptions
APPLICATIONS_BUCKET=mara-applications
```

### SDK Integration

**Client Initialization**: `/src/lib/s3.ts`

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})
```

### API Operations

**Upload Object**:
```typescript
const command = new PutObjectCommand({
  Bucket: process.env.SUBSCRIPTIONS_BUCKET,
  Key: `${randomUUID()}.json`,
  Body: JSON.stringify({
    email: 'user@example.com',
    subscribedAt: new Date().toISOString()
  }),
  ContentType: 'application/json'
})

await s3Client.send(command)
```

### File Organization

**Subscriptions**:
```
mara-subscriptions/
├── {uuid}.json
├── {uuid}.json
└── ...
```

**Applications**:
```
mara-applications/
├── {vacancy-id}/
│   ├── {uuid}.json
│   ├── {uuid}.json
│   └── ...
└── ...
```

### Data Formats

**Subscription JSON**:
```json
{
  "email": "user@example.com",
  "subscribedAt": "2025-11-03T10:30:00.000Z"
}
```

**Application JSON**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+31612345678",
  "additionalInfo": "Cover letter...",
  "appliedAt": "2025-11-03T10:30:00.000Z"
}
```

### Bucket Configuration

**Recommended Settings**:
- Server-side encryption: AES-256 or KMS
- Versioning: Enabled (to prevent accidental deletions)
- Lifecycle policy: Optional (e.g., move to Glacier after 1 year)
- Public access: Blocked (private buckets)

### Error Handling

- **Access denied**: Check IAM user permissions
- **Bucket not found**: Verify bucket name and region
- **Network errors**: Retry with exponential backoff

### Best Practices for AI Agents

1. **Use UUIDs for filenames**: Prevents collisions and ensures uniqueness
2. **Set ContentType**: Helps with future processing
3. **Add metadata**: Use S3 metadata for searchability
4. **Consider encryption**: Use server-side encryption for sensitive data
5. **Implement lifecycle policies**: Auto-archive or delete old submissions
6. **Monitor storage costs**: Use CloudWatch for usage alerts

---

## 6. ClickMeeting Integration

### Purpose
Send video conference invitations to paid event attendees.

### Configuration

**Environment Variables**:
```bash
CLICKMEETING_API_KEY=api-key
CLICKMEETING_ROOM_ID=conference-room-id
```

### API Integration

**Client Setup**: `/src/lib/clickmeeting.ts`

```typescript
const CLICKMEETING_API_BASE = 'https://api.clickmeeting.com/v1'

async function sendInvitation(email: string) {
  const response = await fetch(
    `${CLICKMEETING_API_BASE}/conferences/${roomId}/invitations`,
    {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.CLICKMEETING_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        role: 'attendee'
      })
    }
  )
}
```

### API Operations

**Send Invitation**:
- **Endpoint**: `POST /conferences/{room_id}/invitations`
- **Headers**: `X-Api-Key: {api_key}`
- **Body**: `{ email: string, role: 'attendee' | 'host' }`
- **Response**: `{ invitation_id: string, status: 'sent' }`

### Integration Flow

Triggered by Stripe webhook (`checkout.session.completed`):
1. Stripe payment successful
2. Webhook sent to `/api/clickmeeting`
3. Verify product ID matches event
4. Extract customer email
5. Send ClickMeeting invitation

### Error Handling

- **Invalid API key**: Return 401, log error
- **Room not found**: Return 404, log error
- **Email already invited**: Idempotent (no error)

### Best Practices for AI Agents

1. **Test API key**: Use ClickMeeting dashboard to verify key
2. **Room ID**: Get from ClickMeeting room URL
3. **Role**: Always use `attendee` for paid participants
4. **Retry logic**: Implement for network failures
5. **Logging**: Log all invitation attempts for audit trail

---

## 7. Umami Analytics Integration

### Purpose
Privacy-friendly website analytics (open-source alternative to Google Analytics).

### Configuration

**Environment Variables**:
```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=website-id
NEXT_PUBLIC_UMAMI_URL=https://umami-instance.com
```

### Integration

**Script Embed**: `/src/app/layout.tsx`

```typescript
<script
  defer
  src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
  data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
/>
```

### Tracked Data

**Automatic**:
- Page views
- Referrers
- Device type
- Browser
- Operating system
- Country (from IP)

**Custom Events** (not currently implemented):
```typescript
window.umami.track('button_click', { label: 'donate' })
```

### Privacy

- No cookies
- No personal data collected
- GDPR compliant

### Best Practices for AI Agents

1. **Conditional rendering**: Only load script in production
2. **Custom events**: Track important user actions
3. **Page properties**: Add context to page views
4. **Self-hosting**: Consider self-hosted Umami for full control

---

## 8. Vercel Integration (Hosting Platform)

### Purpose
Hosting, deployment, and serverless functions.

### Features Used

- **Next.js Hosting**: Automatic optimization for Next.js apps
- **ISR**: Incremental Static Regeneration support
- **Serverless Functions**: API routes deployed as serverless functions
- **Speed Insights**: Performance monitoring
- **Environment Variables**: Secure storage of secrets

### Configuration

**Environment Variables**: Set in Vercel dashboard (Settings → Environment Variables)

**Build Settings**:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install --legacy-peer-deps`

### Deployment

**Automatic**:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

**Manual**:
```bash
vercel deploy (preview)
vercel deploy --prod (production)
```

### Serverless Function Limits

- **Timeout**: 10 seconds (Hobby plan), 60 seconds (Pro)
- **Memory**: 1024 MB
- **Payload**: 5 MB request/response

### Best Practices for AI Agents

1. **Environment variables**: Set per environment (Preview, Production)
2. **Preview URLs**: Test on preview deployments before merging
3. **Speed Insights**: Monitor Core Web Vitals after changes
4. **Function duration**: Keep API routes fast (< 5s)

---

## Integration Testing

### Local Testing

**Webhooks**:
1. Use ngrok or Clerk/Stripe CLI for local webhook forwarding
2. Set webhook URLs to local endpoints
3. Trigger events in dashboard

**API Keys**:
1. Use test/sandbox keys in development
2. Switch to production keys only in production environment

**S3**:
1. Use separate dev bucket for testing
2. Consider LocalStack for fully local S3 simulation

### Common Issues

**Sanity Webhooks Not Working**:
- Check webhook secret matches
- Verify webhook URL is correct (HTTPS required)
- Check Sanity dashboard for delivery logs

**Stripe Webhooks Failing**:
- Verify signature verification code
- Check webhook endpoint is POST only
- Use Stripe CLI to test locally

**Google Workspace API Errors**:
- Verify service account has domain-wide delegation
- Check private key format (newlines must be preserved)
- Ensure subject email is admin account

**S3 Upload Failures**:
- Check IAM permissions (PutObject required)
- Verify bucket name and region
- Ensure credentials are correct

---

## Environment Variable Checklist

### Required for All Environments

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Google Workspace
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SUBJECT_EMAIL=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SUBSCRIPTIONS_BUCKET=
APPLICATIONS_BUCKET=

# ClickMeeting
CLICKMEETING_API_KEY=
CLICKMEETING_ROOM_ID=

# Umami
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_URL=
```

### Environment-Specific

**Development**:
- Use test/sandbox API keys
- Local or staging Sanity dataset
- Separate S3 buckets

**Production**:
- Live API keys
- Production Sanity dataset
- Production S3 buckets

---

## Security Best Practices

1. **Rotate secrets regularly**: Update API keys quarterly
2. **Use environment-specific keys**: Never use production keys in development
3. **Verify webhook signatures**: Always validate incoming webhooks
4. **Limit API permissions**: Use principle of least privilege
5. **Monitor API usage**: Set up alerts for unusual activity
6. **Encrypt sensitive data**: Use server-side encryption for S3
7. **Audit logs**: Review integration logs regularly
8. **Rate limiting**: Implement for public API endpoints
9. **CORS configuration**: Restrict origins for API routes
10. **Error messages**: Don't expose sensitive info in error responses
