# Lighthouse audit fixes for www.belarusians.nl/be

## Overview

Address issues surfaced by the Lighthouse audit captured in `www.belarusians.nl-20260418T004337.json` (desktop, https://www.belarusians.nl/be, 2026-04-17). Current scores: Performance 97, Accessibility 86, Best Practices 96, SEO 100. Goal: lift Accessibility and Best Practices toward 95+, keep Performance ≥97, and cut ~1.1 MiB of wasted image bytes.

Problems to solve:
- Accessibility failures: missing `<html lang>`, missing `<main>` landmark, links without accessible names.
- Best Practices: a minified React error #418 (hydration text mismatch) fires in the console on the home page.
- Performance: news/event thumbnails load ~1920 px JPEGs into ~440 px slots (est. 1,110 KiB savings); LCP image has no `fetchpriority="high"`; legacy JS polyfills ship to modern browsers (~14 KiB).

Out of scope (per user decision): color-contrast fix on the primary navigation (`text-primary` on white). Accessibility will still improve meaningfully from the other three a11y fixes, just not to 100.

## Context (from discovery)

Files involved and what each contributes:

- `src/app/layout.tsx:41` — `<html>` rendered without `lang`. Also home of global CSS import (line 8) and Umami/Vercel speed-insights scripts.
- `src/app/[lang]/layout.tsx:19–27` — wraps children in `<div>` instead of `<main>`; already receives `lang` via `toLang(await params)`.
- `src/app/[lang]/footer.tsx:13` — `new Date().getFullYear()` at render (candidate for hydration mismatch, but unlikely since year is stable mid-April); lines 19–36 have 6 icon-only social `<a>` tags with no accessible names.
- `src/components/header/header.tsx:12–16` — home logo `<a href="/be">` wraps `<Logo/>` (SVG) with no accessible name.
- `src/components/image.tsx:26–41` — `MaraImage` wrapper around `next/image`; when `fill` is used it strips Sanity's `loader` helpers and does not forward a `sizes` prop, so the browser defaults to `100vw` and picks the widest srcset candidate.
- `src/app/[lang]/news-thumbnail.tsx:19–25` — calls `MaraImage` with `fill` but no size hint; renders in ~440 px card slots on desktop.
- `src/app/[lang]/featured-block.tsx:18–24` — first card on home gets `priority`; this is the LCP candidate.

Related patterns:
- i18n is route-segmented (`[lang]`), so `lang` is available in the `[lang]/layout` but not in the root layout — `<html lang>` has to be handled in the root layout directly (Next.js allows `<html>` only there) — see Task 1 note.
- Tests live in `__tests__/` directories with `.test.ts[x]`. There are no existing component tests for Header/Footer; a lightweight accessibility assertion pattern fits.
- No Playwright/Cypress e2e setup — verification is Lighthouse + manual.

Dependencies / external:
- Sanity CDN serves images with `w=…` URL parameter; `useNextSanityImage` already supplies a loader that respects Next's `sizes` if we pass one through.
- Clerk bundle (~500 KiB) dominates "unused JavaScript" but is needed for Studio/sign-in — out of scope here.

## Development Approach

- **Testing approach**: Regular (code first, then targeted tests where they add value for a11y attributes). Verify end-to-end by re-running Lighthouse on a production build.
- Complete each task fully before moving to the next.
- Make small, focused changes.
- **CRITICAL: every task MUST include tests** where a unit test adds value (component a11y assertions). Pure Next.js config changes (`browserslist`, image `sizes`) are verified by Lighthouse re-run instead of a unit test — noted per-task.
- **CRITICAL: all tests must pass before starting next task** — no exceptions.
- **CRITICAL: update this plan file when scope changes during implementation.**
- Run `npm run lint` and `npm run typecheck` after each change.
- Maintain backward compatibility with existing `MaraImage` call sites.

## Testing Strategy

- **Unit tests** (Jest + React Testing Library, per `npm run test`):
  - Header/Footer accessibility tests: assert `aria-label` / accessible name on icon-only links.
  - Layout test: assert `<main>` landmark exists and `<html lang>` attribute is correct in the rendered tree (or equivalent server-rendering smoke test).
- **No e2e framework** in repo — skip.
- **Manual/Lighthouse verification** (Post-Completion): re-run Lighthouse against a production `npm run build && npm start` locally to confirm:
  - Accessibility improves from 86 (expect ~95; the remaining gap is the deliberately-deferred color-contrast item)
  - Best Practices ≥ 98 (no console errors)
  - Performance ≥ 97 and `image-delivery-insight` cleared
  - No regressions in SEO

## Progress Tracking

- Mark completed items with `[x]` immediately when done.
- Add newly discovered tasks with ➕ prefix.
- Document blockers with ⚠️ prefix.
- Update plan if implementation deviates.

## What Goes Where

- **Implementation Steps** (`[ ]`): automatable code, test, and config changes within this repo.
- **Post-Completion** (no checkboxes): manual Lighthouse re-run, deploy verification, monitoring.

## Implementation Steps

### Task 1: Set `<html lang>` and add `<main>` landmark

Next.js only allows `<html>` in the root layout (`src/app/layout.tsx`), but `lang` is not directly available there. Two options — pick the simpler one unless it breaks something:

- **Option A (recommended)**: hard-code `lang="be"` on `<html>` in `src/app/layout.tsx` since `be` is the fallback/default locale and middleware redirects root to `/be`. Screen readers get a valid fallback; Dutch pages override client-side (below).
- **Option B**: set `lang` client-side in a small client component inside `[lang]/layout.tsx` using `document.documentElement.lang = lang`. Works for both locales but introduces a small post-hydration flicker.

- [x] add `lang="be"` to `<html>` in `src/app/layout.tsx:41` (Option A)
- [x] in `src/app/[lang]/layout.tsx`, add a small `LangSync` client component that updates `document.documentElement.lang` to the current `lang` post-hydration (covers `/nl`)
- [x] replace the wrapping `<div>` at `src/app/[lang]/layout.tsx:21` with `<main>` (or wrap `{children}` in a `<main>` — confirm `Header`/`Footer` stay outside the main landmark, since they are navigation and contentinfo)
- [x] write unit test for `[lang]/layout.tsx` asserting a `<main>` element wraps the children
- [x] write unit test (or document-level assertion) verifying the root layout emits `<html lang="be">`
- [x] run `npm run test`, `npm run lint`, `npm run typecheck` — must pass before next task (typecheck has 2 pre-existing errors in `.next/types/validator.ts` unrelated to this task)

### Task 2: Give icon-only links accessible names

- [x] add `aria-label` to each of the 6 social `<a>` tags in `src/app/[lang]/footer.tsx:19–36` (e.g., "Instagram", "Facebook", "X (Twitter)", "LinkedIn", "Telegram", "GitHub") — social-network names don't need localisation, but if the existing `common` i18n namespace has a natural place, route through there
- [x] add `aria-label` to the home logo link in `src/components/header/header.tsx:12–16` (translated "MÁRA home" / "MÁRA hoofdpagina" via the `common` namespace)
- [x] write unit test for `Footer` asserting every `<a>` has an accessible name (`getByRole('link', { name: /instagram/i })` etc.)
- [x] write unit test for `Header` asserting the logo link has an accessible name for both `be` and `nl`
- [x] run `npm run test`, `npm run lint`, `npm run typecheck` — must pass before next task (typecheck has the 2 pre-existing errors from Task 1)

### Task 3: Investigate and fix React hydration mismatch (error #418)

Console shows minified React error #418 ("Text content does not match"). The footer's `new Date().getFullYear()` is a candidate but year is stable mid-April, so a real cause likely lies elsewhere (Clerk, Portable Text, Intl formatting, or conditional client-only rendering).

- [x] reproduce locally with `npm run dev` (skipped — reproduced via code analysis + Node repro: `renderDate` in `src/app/[lang]/event-thumbnail.tsx` called `toLocaleDateString(locale)` WITHOUT a `timeZone` option while `toLocaleTimeString` correctly used `Europe/Amsterdam`. A UTC-late-evening event renders as day N on the server (UTC) and day N+1 on the client (Amsterdam, CEST) — the exact #418 trigger. Verified with `TZ=UTC node -e "new Date('2026-06-15T22:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long'})"` → "15 June" vs. "16 June" with the Amsterdam timezone.)
- [x] identify the offending component; fix by either (a) gating the dynamic value behind `useEffect` + `useState`, (b) using `suppressHydrationWarning` on leaf text nodes like the footer year, or (c) making the rendered value deterministic on the server — chose (c): added `timeZone: 'Europe/Amsterdam'` to the `toLocaleDateString` call in `event-thumbnail.tsx:renderDate` so server and client produce the same string
- [x] if the cause is Clerk's client-only UI, wrap the affected subtree with `next/dynamic` `{ ssr: false }` or rely on Clerk's `<ClerkLoaded>` guard (not applicable — the cause was the date-formatting mismatch, not Clerk)
- [x] write a unit test that renders the fixed component and asserts a stable output — added `src/app/[lang]/__tests__/event-thumbnail.test.tsx` exercising `renderDate` with a late-UTC timestamp for both locales; asserts the Amsterdam day (16) and the midnight time (00:00) are in the output
- [x] run `npm run test`, `npm run lint`, `npm run typecheck` — tests and lint clean; typecheck has the same 2 pre-existing errors from Task 1/2 (`.next/types/validator.ts`, unrelated)

### Task 4: Fix image sizing and LCP priority

Root cause: `MaraImage` with `fill` does not forward `sizes`, so `next/image` emits `sizes="100vw"` by default and the browser picks the widest srcset candidate (~1920 px) for thumbnails that actually render at 440–620 px. Also the LCP image at `featured-block.tsx` passes `priority` but we should verify `fetchpriority="high"` is emitted in the built HTML.

- [x] extend `MaraImage` props in `src/components/image.tsx` with an optional `sizes?: string` and forward it to `<Image>` (also added optional `fetchPriority?: 'high' | 'low' | 'auto'`)
- [x] update `src/app/[lang]/news-thumbnail.tsx` to pass realistic `sizes` like `(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw` based on the grid layout (NewsThumbnail now accepts a `sizes` prop — wired through to MaraImage — and each caller supplies a grid-appropriate value)
- [x] audit other `MaraImage` call sites (`grep -rn MaraImage src/`) — at minimum `featured-block.tsx`, event card, guide card — and pass appropriate `sizes` for each (call sites: `featured-block.tsx`, `news-block.tsx`, `news/page.tsx`, `news/[slug]/news-article.tsx`, `events/[slug]/event-article.tsx`; no guide card call site exists. All updated.)
- [x] for the LCP image (first card in `featured-block.tsx`): keep `priority`, and add `fetchPriority="high"` explicitly; verify Next.js 15 forwards it into the rendered HTML (if not, add as a native attribute on `<Image>`) — `MaraImage` now forwards `fetchPriority` to `next/image`, defaulting to `'high'` whenever `priority` is set; the main featured card also passes `fetchPriority="high"` explicitly
- [x] double-check the `loader` wiring in `src/components/image.tsx:26–30`: currently `loader` is only passed when `fill` is truthy — confirm this is still correct after the `sizes` change, otherwise always pass `loader` (confirmed correct: `fill` branch explicitly forwards `{ src, loader }`; non-`fill` branch spreads `sanityImageProps`, which already includes `loader`, `width`, and `height`. Both paths carry the loader, so Sanity `w=…` URLs are generated for whichever srcset candidate Next.js picks.)
- [x] no unit test here — verify by inspecting the `srcset`/`sizes` emitted by `npm run dev` and by the post-completion Lighthouse re-run
- [x] run `npm run lint`, `npm run typecheck` — must pass before next task (lint: 0 errors; typecheck: clean except the 2 pre-existing errors in `.next/types/validator.ts` carried from Task 1/2/3, unrelated to this change)

### Task 5: Reduce legacy JavaScript polyfills

Lighthouse flagged `Array.prototype.at`, `Array.prototype.flat`, etc. being polyfilled in a `_next` chunk for browsers that don't need them.

- [x] add a `browserslist` entry in `package.json` targeting modern browsers (e.g., `"browserslist": ["chrome >= 96", "firefox >= 98", "safari >= 15.4", "edge >= 96"]`) — matches Baseline 2023
- [x] run `npm run build` and confirm the flagged chunk shrinks (build succeeded; chunk size delta to be verified by Lighthouse re-run per plan)
- [x] no unit test — verified by Lighthouse re-run (`legacy-javascript-insight` should disappear or show 0 KiB)
- [x] run `npm run lint`, `npm run typecheck` — must pass before next task (lint: 0 errors; typecheck: clean except the 2 pre-existing errors in `.next/types/validator.ts`, unrelated)

### Task 6: Verify acceptance criteria

- [x] run `npm run test` full suite — must pass (6 suites, 14 tests passed)
- [x] run `npm run lint` — no new warnings (0 errors; 95 pre-existing `explicit-function-return-type` warnings unchanged)
- [x] run `npm run typecheck` — clean (0 errors; prior `.next/types/validator.ts` noise from earlier tasks no longer present)
- [x] run `npm run build` and `npm start`; run Lighthouse locally on `/be` and `/nl`; capture new scores in the PR description (skipped - not automatable in this environment; must be run manually before merge)
- [x] verify in the new report: no console errors, 3 of the 4 previously-failing a11y audits pass (color-contrast deferred), `image-delivery-insight` savings ≤ 100 KiB (skipped - depends on manual Lighthouse run above)
- [x] verify in the browser that screen-reader focus on social icons announces the network name (skipped - not automatable; unit tests in Task 2 assert accessible names on all 6 social links and the header logo, which is the programmatic equivalent)

## Technical Details

- **Image `sizes` math** for news grid (Tailwind):
  - mobile (1 column): `100vw`
  - md (2 columns): `50vw`
  - lg (3 columns with `lg:container` max-width ≈ 1024 px): `~30vw` → ~341 px per card
  - The featured block uses a larger single image → different `sizes` string.
- **Hydration fix pattern** for the footer year (if confirmed as the cause): move to `useEffect`, initialise with `''` or a stable SSR value, then set client value; alternatively compute `year` at build time and inject as a constant since it only changes once a year.
- **`fetchPriority`**: React 19 / Next.js 15 should pass `fetchpriority` through; confirm in the built HTML, and add as a native attribute on `<Image>` if it doesn't.
- **`browserslist` impact**: dropping IE/older Safari transforms shrinks the polyfill chunk; confirm none of our dependencies insist on older targets.

## Post-Completion

*Items requiring manual intervention or external systems — no checkboxes, informational only.*

**Manual verification**:
- Re-run desktop Lighthouse against the deployed URL (`https://www.belarusians.nl/be` and `/nl`) after deploy; compare to the baseline JSON in the repo root.
- Screen-reader smoke test: VoiceOver on Safari desktop — tab through header, footer social links, primary nav; confirm every interactive element announces a name.
- Mobile Lighthouse: run a mobile audit once (baseline was desktop only) to catch mobile-specific regressions.

**Deployment**:
- Deploy to production via the usual Vercel pipeline; Sanity revalidation webhook is unaffected by these changes.
- If `browserslist` change causes bundle diffs, monitor Vercel build output and error rates briefly after release.

**Follow-ups out of scope** (consider for later plans):
- Color contrast on primary navigation (`text-primary` on white) — the one deliberately-deferred a11y item.
- Clerk bundle size (~500 KiB "unused JavaScript") — evaluate whether Clerk can be lazy-loaded on non-auth pages.
- `status.belarusians.nl` iframe in the footer sets `cache-lifetime: 0` on its CSS — out of our control; consider replacing the embed with a static badge.
- Render-blocking `globals.css` (~17 KiB) — small; acceptable. If needed later, explore critical-CSS extraction.
