# Security Hardening Review

## Overview
- Comprehensive security audit and remediation for the MARA website, a Belarusian democratic organization facing state-level threats
- Addresses critical vulnerabilities found during code review: secret exposure, missing auth layers, information leakage, header gaps
- Covers code-level fixes and infrastructure verification (S3, deployment config, dependency audit)

## Context (from discovery)
- **Files/components involved**:
  - `src/proxy.ts` — Clerk middleware (Studio exclusion)
  - `src/app/(sanity)/studio/` — unprotected Sanity Studio
  - `src/app/api/clickmeeting/route.ts` — error information leakage
  - `next.config.js` — security headers & CSP
  - `src/app/api/rate-limit.ts` — rate limiting implementation
  - `.env.local` — secrets (need git history audit)
  - `src/lib/s3.ts`, `src/lib/stripe.ts`, `src/lib/google-directory.ts` — integrations
- **Strengths already in place**: Webhook signature verification, Zod validation, security headers (CSP, X-Frame-Options, X-Content-Type-Options), rate limiting, proper env var isolation
- **Threat model**: State-level adversary (Belarusian government) targeting democratic organization

## Development Approach
- **Testing approach**: Regular (code first, then tests)
- Complete each task fully before moving to the next
- Make small, focused changes
- **CRITICAL: every task MUST include new/updated tests** for code changes in that task
- **CRITICAL: all tests must pass before starting next task**
- **CRITICAL: update this plan file when scope changes during implementation**
- Run tests after each change
- Maintain backward compatibility
- Priority order: Critical > High > Medium > Infrastructure

## Testing Strategy
- **Unit tests**: required for every task
- **E2E tests**: not currently in project — skip

## Progress Tracking
- Mark completed items with `[x]` immediately when done
- Add newly discovered tasks with + prefix
- Document issues/blockers with !! prefix
- Update plan if implementation deviates from original scope

## Implementation Steps

### Task 1: Audit git history for leaked secrets
- [x] Run `git log -p --all -S CLERK_SECRET_KEY` to check if secrets were committed — CLEAN (only process.env reference)
- [x] Run `git log -p --all -S SANITY_API_WRITE_TOKEN` to check Sanity token history — CLEAN
- [x] Run `git log -p --all -S sk_live_` to check for any Stripe secret keys — CLEAN (only doc comment)
- [x] Run `git log -p --all -S AWS_SECRET_ACCESS_KEY` to check for AWS keys — CLEAN
- [x] Verify `.env.local` is in `.gitignore` — YES (`.env*.local` pattern)
- [x] Document findings and recommend token rotation if any secrets were committed — No rotation needed
- [x] No tests needed — audit-only task

### Task 2: Add HSTS and missing security headers
- [x] Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to `next.config.js`
- [x] Add `X-Permitted-Cross-Domain-Policies: none` header
- [x] Add `Cross-Origin-Opener-Policy: same-origin` header
- [x] Add `Cross-Origin-Resource-Policy: same-origin` header
- [x] Write tests verifying security headers are present in config (`src/__tests__/security-headers.test.ts`)
- [x] Run tests — 11 passed

### Task 3: Protect Sanity Studio with Clerk auth — SKIPPED
- [x] User decided to rely on Sanity's own authentication (Studio has built-in auth)
- [x] Replacing Sanity login with Clerk not feasible without losing per-user audit trails

### Task 4: Fix error information leakage in API routes
- [x] In `src/app/api/clickmeeting/route.ts`: replace detailed error messages with generic ones
- [x] Ensure Stripe webhook error returns generic "Webhook verification failed"
- [x] Ensure ClickMeeting invite error returns generic "Internal server error"
- [x] Ensure unhandled event type doesn't leak Stripe event type names
- [x] Audit all other API routes for error message leakage — only clickmeeting had issues
- [x] Add server-side logging with `[ClickMeeting Webhook]` prefix for debugging
- [x] Updated route imports to use `@/` alias, added `moduleNameMapper` to `jest.config.js`
- [x] Write tests verifying error responses don't leak internals (`src/app/api/clickmeeting/__tests__/route.test.ts`)
- [x] Run tests — 16 passed

### Task 5: Harden CSP policy
- [x] Evaluate feasibility of removing `'unsafe-eval'` — safe, no eval/Function/string-setTimeout in codebase
- [x] Removed `'unsafe-eval'` from script-src
- [x] `'unsafe-inline'` must stay — needed for JSON-LD schema in layout.tsx. Added code comment explaining why.
- [x] Nonce-based approach not needed — JSON-LD is the only inline script
- [x] Added `upgrade-insecure-requests` directive to CSP
- [x] Added tests: CSP must not contain unsafe-eval, must contain upgrade-insecure-requests
- [x] Run tests — 17 passed

### Task 6: Improve rate limiting resilience
- [x] Added rate limiting to `/api/revalidate` (30/min), `/api/webhooks/clerk` (30/min), `/api/clickmeeting` (30/min)
- [x] Fixed error info leakage in `/api/revalidate` — was exposing raw error object to response
- [x] In-memory limitation already documented in code comment (line 16-17 of rate-limit.ts)
- [x] Wrote rate limiter unit tests (`src/app/api/__tests__/rate-limit.test.ts`)
- [x] Run tests — 21 passed

### Task 7: Run dependency security audit
- [ ] Run `npm audit` and document findings
- [ ] Fix any critical/high vulnerabilities with `npm audit fix`
- [ ] Review remaining vulnerabilities and assess risk
- [ ] Check for outdated dependencies with `npm outdated` — flag security-relevant packages
- [ ] Run tests — must pass before next task

### Task 8: Infrastructure verification checklist
- [ ] Verify `.env.local` is in `.gitignore` and not tracked
- [ ] Document S3 bucket security requirements: block public access, encryption, versioning
- [ ] Verify Vercel deployment strips untrusted `x-forwarded-for` headers (document finding)
- [ ] Verify all NEXT_PUBLIC_ variables are safe to expose publicly
- [ ] Check that no API routes are accessible without proper auth/verification where needed
- [ ] Create `docs/SECURITY.md` documenting security architecture and operational procedures
- [ ] No tests needed — documentation/verification task

### Task 9: Verify acceptance criteria
- [ ] Verify all critical issues (secret audit, HSTS) are resolved
- [ ] Verify all high issues (Studio auth, error leakage) are resolved
- [ ] Verify all medium issues (CSP, rate limiting, dependencies) are resolved
- [ ] Run full test suite (unit tests)
- [ ] Run linter — all issues must be fixed
- [ ] Verify test coverage meets project standard (80%+)

### Task 10: [Final] Update documentation
- [ ] Update README.md if needed
- [ ] Update CLAUDE.md if new security patterns discovered
- [ ] Update project knowledge docs if new patterns discovered

## Technical Details

### Secret Rotation Procedure
If secrets found in git history:
1. Revoke compromised tokens immediately in respective dashboards (Clerk, Sanity, Stripe, AWS)
2. Generate new tokens
3. Update `.env.local` and production environment (Vercel dashboard)
4. Consider using `git filter-repo` or BFG Repo Cleaner to remove secrets from history
5. Force-push cleaned history (requires team coordination)

### Studio Auth Guard
```typescript
// src/app/(sanity)/studio/layout.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function StudioLayout({ children }) {
  const { userId } = await auth();
  if (!userId) redirect('/');
  return children;
}
```

### Security Headers Addition
```javascript
// Add to next.config.js headers array
{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
{ key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
{ key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
```

### Error Response Pattern
```typescript
// Generic error for clients
sendError(500, 'Internal server error');

// Detailed logging server-side
console.error('[ClickMeeting Webhook]', { error: err.message, stack: err.stack, timestamp: new Date().toISOString() });
```

## Post-Completion
*Items requiring manual intervention or external systems — no checkboxes, informational only*

**Manual verification**:
- Verify `/studio` redirects unauthenticated users (manual browser test)
- Verify security headers appear in production responses (`curl -I https://belarusians.nl`)
- Test rate limiting by sending rapid requests to endpoints
- Verify S3 buckets have public access blocked via AWS Console

**External system updates**:
- Rotate all secrets if git history audit reveals exposure (Clerk Dashboard, Sanity Dashboard, AWS IAM Console)
- Verify Vercel environment variables match new rotated secrets
- Consider enabling Vercel's DDoS protection features
- Consider adding Vercel's Web Application Firewall (WAF) if available on plan
- Set up uptime monitoring for critical endpoints

**Ongoing security practices**:
- Schedule quarterly dependency audits (`npm audit`)
- Monitor Clerk, Sanity, and Stripe security advisories
- Consider adding automated secret scanning to CI (e.g., `gitleaks`, `trufflehog`)
- Review Vercel access logs periodically for suspicious patterns
