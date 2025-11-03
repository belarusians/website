# Architecture Overview

> **Purpose**: This document provides AI agents with a high-level understanding of the MARA website architecture, system components, and their interactions. Code-level details are intentionally omitted as code should be self-documented.

## System Summary

**MARA Website** is a Next.js-based web application for the Association of Belarusians in the Netherlands (belarusians.nl). It's a multilingual (Belarusian/Dutch) platform featuring events, news, guides, job vacancies, and donation capabilities.

### Tech Stack Core

- **Framework**: Next.js 15.3.5 (App Router, React 19)
- **Language**: TypeScript 5.7.3 (strict mode)
- **CMS**: Sanity 3.99.0 (headless)
- **Auth**: Clerk 6.12.5 + Google Workspace Directory API
- **Payments**: Stripe 15.6.0
- **Styling**: Tailwind CSS 4.0.15
- **i18n**: i18next 25.2.1
- **Deployment**: Vercel

## Architecture Patterns

### 1. Locale-First Routing

All pages use dynamic route parameter `[lang]` at the root level (`/src/app/[lang]/*`). Middleware enforces:
- Locale prefix requirement (be/ or nl/)
- Russian-to-Belarusian redirect (/ru → /be)
- Trailing slash removal
- Static generation via `generateStaticParams()`

**Decision rationale**: Consistent URL structure, SEO optimization, and predictable routing.

### 2. Headless CMS Architecture

Content is managed in Sanity CMS with custom multi-language field types:
- **localeString**: Multi-language single-line text
- **localeText**: Multi-language multi-line text
- **localeContent**: Multi-language Portable Text (rich text)

Content types: Event, News, Guide, Vacancy, Feedback.

**Decision rationale**: Decouples content from presentation, enables non-technical editors, supports structured content.

### 3. Incremental Static Regeneration (ISR)

- **Default strategy**: `force-cache` with cache tags
- **Revalidation trigger**: Sanity webhooks → `/api/revalidate`
- **Webhook security**: HMAC signature verification
- **Granularity**: Tag-based (`revalidateTag()`) + path-based (`revalidatePath()`)

**Decision rationale**: Performance of static sites with freshness of dynamic content, no manual deployments needed.

### 4. API-First Integration Layer

RESTful API routes handle external service interactions:
- `/api/donate/link` - Stripe payment link generation
- `/api/subscribe` - Email subscriptions (→ S3)
- `/api/vacancies/apply` - Job applications (→ S3)
- `/api/clickmeeting` - Stripe webhook handler (→ ClickMeeting invites)
- `/api/webhooks/clerk` - User lifecycle events
- `/api/revalidate` - Content update triggers

**Decision rationale**: Separation of concerns, secure credential handling, webhook-based automation.

### 5. Role-Based Access Control (RBAC)

Authentication flow:
1. Clerk handles user auth (sign-in/sign-up)
2. Backend queries Google Workspace Directory API
3. Maps user's Google Groups to roles:
   - `administratie@belarusians.nl` → Admin
   - `editors@belarusians.nl` → Editor
   - Default → Member

**Decision rationale**: Leverages existing organizational infrastructure, no custom role management needed.

## System Components

### Frontend Layer

```
/src/app/[lang]/
├── layout.tsx          # Clerk provider, header, footer, i18n setup
├── page.tsx            # Home page
├── events/             # Events listing & detail pages
├── news/               # News listing & detail pages
├── guides/             # Guides listing & detail pages
├── vacancies/          # Job postings & application forms
├── donate/             # Donation forms
└── about-us/           # Static informational pages
```

**Key characteristics**:
- Server components by default (React 19)
- Client components only when interactivity required
- Metadata generation for SEO
- Static generation with ISR

### Content Layer (Sanity)

Located at `/studio` route (route group: `(sanity)`).

**Schemas** (`/src/sanity/*/schema.ts`):
- Event: dates, location, ticket/tip links, cancellation status
- News: articles with portable text
- Guide: educational content with excerpts
- Vacancy: job postings with task descriptions
- Feedback: user testimonials

**Services** (`/src/sanity/*/service.ts`):
- GROQ query functions (e.g., `getAllEvents()`, `getEventBySlug()`)
- Cache tag attachment
- Portable Text → HTML conversion

### API Layer

Located at `/src/app/api/*/route.ts`.

**Responsibilities**:
- External service orchestration
- Request validation (Zod schemas)
- Webhook signature verification
- Error handling with standardized responses

### Integration Layer

Located at `/src/lib/*.ts`.

**Modules**:
- `stripe.ts` - Stripe SDK wrapper (products, prices, payment links)
- `google-directory.ts` - Google Workspace API client (role fetching)
- `clickmeeting.ts` - ClickMeeting API client (attendee invitations)
- `s3.ts` - AWS S3 client (file storage)
- `email.ts` - Email validation utilities

### Middleware

Located at `/src/middleware.ts`.

**Responsibilities**:
- Locale detection and enforcement
- URL normalization
- Clerk authentication passthrough
- Static asset/API route exclusions

## Directory Structure Philosophy

```
/src/
├── app/                 # Next.js App Router (routes, layouts, pages)
│   ├── [lang]/         # Locale-specific routes
│   ├── (sanity)/       # Sanity Studio route group
│   ├── api/            # API routes
│   └── i18n/           # i18n configuration and translations
├── components/          # React components (organized by route)
├── lib/                # External service clients and utilities
├── sanity/             # Sanity schemas, queries, types
├── contract/           # API validation schemas (Zod)
└── utils/              # General utilities (OG metadata, etc.)
```

**Organizational principles**:
- Route-based component organization
- Co-location of related schemas/services in Sanity modules
- Clear separation of concerns (app vs lib vs sanity)

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Image domains, redirects, React strict mode |
| `tsconfig.json` | Strict TypeScript, path aliases (`@/*` → `./src/*`) |
| `sanity.config.ts` | Studio config, schemas, plugins |
| `package.json` | Dependencies, npm scripts (dev, build, lint, test) |
| `.env.*` | Environment-specific variables (API keys, URLs) |
| `CLAUDE.md` | AI agent instructions (build commands, code style) |

## Key Architectural Decisions

### 1. Why Force-Cache + ISR?
- **Trade-off**: Predictable performance vs. real-time updates
- **Chosen**: Force-cache with webhook-triggered revalidation
- **Rationale**: Content changes are infrequent, performance is critical

### 2. Why S3 for Form Data?
- **Trade-off**: Database vs. file storage
- **Chosen**: AWS S3 with random filenames
- **Rationale**: Simple, cheap, no need for complex queries on form submissions

### 3. Why Google Workspace for RBAC?
- **Trade-off**: Custom role management vs. external service
- **Chosen**: Google Workspace Directory API
- **Rationale**: Organization already uses Google Groups, no duplicate management

### 4. Why Portable Text?
- **Trade-off**: HTML vs. structured content
- **Chosen**: Sanity Portable Text
- **Rationale**: Multi-language support, structured data, future flexibility

### 5. Why Middleware for Locale Routing?
- **Trade-off**: Client-side detection vs. middleware
- **Chosen**: Middleware-based enforcement
- **Rationale**: SEO, predictable URLs, server-side rendering optimization

## Performance Characteristics

- **Static Generation**: All pages pre-rendered at build time
- **ISR**: Content updates within minutes (webhook-triggered)
- **Image Optimization**: Next.js Image component + Sanity CDN
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Aggressive force-cache with tag-based invalidation
- **Monitoring**: Vercel Speed Insights, Umami Analytics

## Security Model

- **Authentication**: Clerk handles user sessions (JWT tokens)
- **Authorization**: Google Workspace API for role-based permissions
- **Webhook Security**: HMAC signature verification (Sanity, Stripe, Clerk)
- **API Key Management**: Environment variables, never committed
- **Content Security**: Sanity CORS configuration
- **Input Validation**: Zod schemas for all API endpoints

## Testing Strategy

- **Unit Tests**: Jest with ts-jest (`__tests__/` directories)
- **Type Safety**: TypeScript strict mode (compile-time checks)
- **Linting**: ESLint with strict rules (no-any, unused vars)
- **Formatting**: Prettier (120 char width, single quotes)
- **CI/CD**: GitHub Actions (lint + test on PRs)

## Deployment Pipeline

```
Code Push → GitHub → GitHub Actions (lint + test)
                   ↓
              Vercel (auto-deploy)
                   ↓
         Production (belarusians.nl)
```

**Environment detection**:
- Development: `localhost:3000`
- Production: `VERCEL_URL` or fallback to `belarusians.nl`

## Extension Points for AI Agents

When working with this codebase, AI agents should:

1. **Follow locale-first routing**: Always consider both languages when adding routes
2. **Use Sanity schemas**: Content changes require schema + service + component updates
3. **Implement ISR**: New content types need cache tags and revalidation logic
4. **Validate API inputs**: Use Zod schemas in `/src/contract/` for new endpoints
5. **Maintain type safety**: Never use `any`, always define interfaces/types
6. **Test integrations**: Mock external services in tests (Stripe, S3, etc.)
7. **Update i18n**: Add translations to both `be` and `nl` locale files
8. **Check CLAUDE.md**: Follow code style guidelines and build commands

## Common Operations

### Adding a new content type
1. Create schema in `/src/sanity/[type]/schema.ts`
2. Define TypeScript types in `/src/sanity/[type]/type.ts`
3. Write GROQ queries in `/src/sanity/[type]/service.ts`
4. Create route in `/src/app/[lang]/[type]/`
5. Add revalidation logic to `/src/app/api/revalidate/route.ts`
6. Update Sanity config to include new schema

### Adding a new API endpoint
1. Create route file in `/src/app/api/[name]/route.ts`
2. Define validation schema in `/src/contract/[name].ts`
3. Implement error handling with standardized responses
4. Add authentication/authorization if needed
5. Document in this architecture file

### Adding a new external integration
1. Create client module in `/src/lib/[service].ts`
2. Define environment variables in `.env.*` files
3. Add types for API responses
4. Implement error handling
5. Add to API routes for orchestration
6. Document in INTEGRATIONS.md

### Adding a new page
1. Create route in `/src/app/[lang]/[route]/page.tsx`
2. Add translations to `/src/app/i18n/locales/{be,nl}/translation.json`
3. Implement `generateMetadata()` for SEO
4. Use static generation with `generateStaticParams()` if dynamic
5. Create components in `/src/components/[lang]/[route]/`

## Troubleshooting Guide

### Content not updating after Sanity changes
- Check webhook delivery in Sanity dashboard
- Verify `SANITY_REVALIDATE_SECRET` matches
- Check `/api/revalidate` logs
- Ensure cache tags are correctly assigned

### Authentication issues
- Verify Clerk configuration in environment variables
- Check Google Workspace API service account permissions
- Ensure user is member of correct Google Group
- Check Clerk webhook delivery

### Payment flow failures
- Verify Stripe API keys (test vs. production)
- Check webhook signature verification
- Ensure product IDs match in Stripe dashboard
- Review ClickMeeting API credentials

### Build failures
- Run `npm run typecheck` for TypeScript errors
- Run `npm run lint` for ESLint issues
- Check for missing environment variables
- Verify all imports use path aliases correctly

## Related Documentation

- `DATA_FLOWS.md` - Detailed data flow diagrams
- `INTEGRATIONS.md` - External service integration details
- `CLAUDE.md` - Build commands and code style guidelines
