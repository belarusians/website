# Cookie Consent Banner

## Overview
A custom GDPR-compliant cookie consent banner that gates the existing Google Ads `gtag.js` integration via Google Consent Mode v2. Today `ENABLE_GOOGLE_TAG = false` in `src/app/layout.tsx` — the tag is fully wired but disabled because the site has no consent flow. After this work the tag can be enabled in production while staying compliant for EU/Netherlands visitors.

**Behavior:**
- Banner appears at the bottom on first visit for all users (always-on, no region detection).
- gtag scripts load on every `[lang]` route with all consent signals **defaulted to `denied`**.
- On **Accept** → `gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' })` and persist choice in `localStorage`.
- On **Decline** → consent stays denied; persist choice so banner doesn't reappear.
- On revisit with a stored choice → no banner; if previously granted, immediately upgrade consent on mount.
- Umami stays as-is (cookieless, no consent required).

**Visual design:** ⚠️ designs (layout, copy length, exact spacing/typography, mobile vs desktop variants) will be provided **separately** before Task 3. Do not invent the visual design — the implementation in Task 3 must wait on the designs being delivered. Tasks 1, 2, 4, 5, 6 do not depend on designs and can proceed independently.

**Non-goals:**
- Granular per-category toggles (analytics vs ads). Single binary Accept/Decline.
- Region detection / GeoIP gating.
- A preferences page to revisit choice (could be follow-up work).
- Third-party CMP (Cookiebot/OneTrust). Custom-built only.

## Context (from discovery)

**Files involved:**
- `src/app/layout.tsx` — root layout, currently holds disabled gtag scripts (lines 38, 71–112). gtag will move out.
- `src/app/[lang]/layout.tsx` — per-language layout, target home for gtag scripts + banner. Has `lang` from params.
- `src/app/[lang]/events/[slug]/event-article.tsx:65` — calls `window.gtag_report_conversion(...)`. No change needed; gtag handles gating via consent state.
- `src/app/i18n/client.ts` — exports `getTranslation(lang, ns)` for `'use client'` components. Returns `{ t, i18n }`.
- `src/app/i18n/locales/{be,nl}/` — translation JSON namespaces. New namespace `consent` to be added.
- `src/components/menu/mobile/tabBar.tsx` — fixed bottom 5-tab nav at `< md`. Banner must sit above it on mobile.
- `src/components/menu/mobile/mobileMenu.tsx:50–59` — reference pattern for a fixed-position overlay (`fixed top-0 ... z-20`, `bg-white-shade`).
- `src/components/__tests__/button.test.tsx` — reference for the project's Jest pattern (direct functional invocation, no React Testing Library; `ts-jest`, `testEnvironment: "node"`).
- `src/theme/tokens.ts` + `src/components/globals.css` `@theme` block — `bg-primary` / `text-primary` Tailwind utilities are defined and used elsewhere.

**Patterns found:**
- Client components import `getTranslation` from `@/app/i18n/client` and call `getTranslation(lang, namespace)` with `lang` passed as a prop from a server component (see `mobileMenu.tsx:6,13`).
- No prior `localStorage` usage anywhere in `src/`. This work establishes the pattern. Key name: `mara_consent`.
- Tests use `@jest/globals` and direct function calls; no `@testing-library/react` in the project.
- Theme primary color is `#ed1c24` exposed as `bg-primary` / `text-primary`. Background neutral is `bg-white-shade` (`#f6f6f6`).

**Dependencies identified:**
- No new npm dependencies. Banner uses native DOM + Tailwind + existing i18n.
- `next/script` already imported in `src/app/layout.tsx`; reuse for inline + remote gtag scripts in `[lang]/layout.tsx`.

## Development Approach
- **Testing approach**: Regular (code first, then tests).
- Complete each task fully before moving to the next.
- Make small, focused changes.
- **CRITICAL: every task MUST include new/updated tests** for code changes in that task
  - tests are not optional — they are a required part of the checklist
  - write unit tests for new functions/methods
  - write unit tests for modified functions/methods
  - add new test cases for new code paths
  - update existing test cases if behavior changes
  - tests cover both success and error scenarios
- **CRITICAL: all tests must pass before starting next task** — no exceptions
- **CRITICAL: update this plan file when scope changes during implementation**
- **CRITICAL: do not start Task 3 until visual designs are provided separately.** If Tasks 1, 2, 4 are ready and designs are not, pause and ask the user for designs rather than improvising.
- Run tests after each change
- Maintain backward compatibility (the `gtag_report_conversion` global function signature stays the same; existing event-article click handler is untouched)

## Testing Strategy
- **Unit tests**: required for every task, using the project's Jest + `ts-jest` pattern with `@jest/globals` (see `src/components/__tests__/button.test.tsx`).
  - `consent` helpers: cover localStorage read/write, gtag update side effects, missing `window.gtag`, malformed stored values.
  - `ConsentBanner` component: cover initial visibility based on stored state, Accept/Decline handlers, that `gtag('consent', 'update', …)` is called only on Accept.
  - i18n: import both new JSON files and assert required keys exist.
- **E2E tests**: project does not currently have an e2e harness, so none here. Manual browser verification listed in Post-Completion.

## Progress Tracking
- Mark completed items with `[x]` immediately when done
- Add newly discovered tasks with ➕ prefix
- Document issues/blockers with ⚠️ prefix
- Update plan if implementation deviates from original scope
- Keep plan in sync with actual work done

## What Goes Where
- **Implementation Steps** (`[ ]` checkboxes): code, tests, lint, typecheck — all automatable.
- **Post-Completion** (no checkboxes): manual browser checks, Google Ads tag-detection verification, deploy steps.

## Implementation Steps

### Task 1: Consent helper module (`src/lib/consent.ts`)
- [ ] create `src/lib/consent.ts` exporting: `ConsentChoice = 'granted' | 'denied'`, `readConsent(): ConsentChoice | null`, `writeConsent(choice: ConsentChoice): void`, `applyConsent(choice: ConsentChoice): void` (calls `window.gtag('consent', 'update', { ad_storage, ad_user_data, ad_personalization })` mapping granted/denied uniformly across the three signals)
- [ ] guard against SSR (`typeof window === 'undefined'`) and missing `window.gtag` (no-op gracefully)
- [ ] use localStorage key `mara_consent` storing `{ choice: ConsentChoice, timestamp: number }` JSON
- [ ] write tests `src/lib/__tests__/consent.test.ts`: success cases (read after write returns same value, applyConsent calls gtag with correct args)
- [ ] write tests for error/edge cases (read with no key returns null, read with malformed JSON returns null and clears the key, applyConsent without window.gtag is a no-op)
- [ ] run `npx jest src/lib/__tests__/consent.test.ts` — must pass before next task

### Task 2: Consent translation namespace
- [ ] create `src/app/i18n/locales/be/consent.json` with keys: `title`, `body`, `accept`, `decline`, `aria.region` (Belarusian copy — use placeholder copy if final wording is part of the design deliverable)
- [ ] create `src/app/i18n/locales/nl/consent.json` with the same keys (Dutch copy)
- [ ] keep copy short (≤ 2 sentences in `body`) and mention what data goes where: Google Ads measures conversions; Umami stays cookieless; user can decline
- [ ] write test `src/app/i18n/locales/__tests__/consent.test.ts` that imports both JSON files and asserts each required key is a non-empty string
- [ ] run `npx jest src/app/i18n/locales/__tests__/consent.test.ts` — must pass before next task

### Task 3: `ConsentBanner` client component (`src/components/consent/banner.tsx`)

⚠️ **Blocked on designs.** Do not start until visual designs (mobile + desktop) are provided separately. Layout, spacing, button styles, copy positioning, animation, color choices for non-primary elements all come from the design — do not improvise. Once designs are in hand, follow them precisely; the checkboxes below cover behavior + structure but the visual rendering must match the provided designs.

- [ ] create `src/components/consent/banner.tsx` with `'use client'`; props: `{ lang: Lang }`
- [ ] on mount via `useEffect`: read stored choice; if `'granted'` call `applyConsent('granted')`; if no stored choice set state to show banner
- [ ] render banner only when `visible` state is true; positioning must respect the mobile tab bar (sit above it at `< md`) and follow the design at `≥ md` — exact classNames driven by the provided design
- [ ] include title, body, and two buttons: Accept and Decline; reuse the project's `Button` component (`@/components/button`) where it fits the design, otherwise hand-rolled markup that matches the design
- [ ] a11y: wrap in `<section role="region" aria-label={t('aria.region')}>`, ensure both buttons are keyboard reachable, no focus trap (banner is non-modal — declining or accepting hides it)
- [ ] handlers: `onAccept` → `writeConsent('granted')` + `applyConsent('granted')` + hide; `onDecline` → `writeConsent('denied')` + hide (no gtag call needed; default-denied already in effect)
- [ ] write tests `src/components/consent/__tests__/banner.test.tsx`: rendered tree shape under each state (visible/hidden) using direct functional invocation matching `button.test.tsx` pattern
- [ ] write tests for handler logic: stub `localStorage` and `window.gtag`, invoke handlers extracted via dependency injection or by testing the helpers from Task 1 directly (banner should be a thin wrapper)
- [ ] run `npx jest src/components/consent/__tests__/banner.test.tsx` — must pass before next task

### Task 4: Wire gtag + banner into `src/app/[lang]/layout.tsx`
- [ ] in `src/app/[lang]/layout.tsx`, add `next/script` imports and inline `<Script id="gtag-consent-default">` that runs **before** the gtag.js src loads, body: ```window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); gtag('js', new Date()); gtag('config', 'AW-XXXXXXXXXX');``` — replace placeholder with the real account ID once chosen (see Post-Completion)
- [ ] add `<Script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX" />` after the inline default-consent block
- [ ] preserve the existing `gtag_report_conversion` helper script (copied verbatim from current `src/app/layout.tsx:97–109`) so `event-article.tsx:65` keeps working unchanged
- [ ] mount `<ConsentBanner lang={lang} />` as a sibling of `{children}` (alongside the mobile tab bar)
- [ ] in `src/app/layout.tsx`, **delete** the `ENABLE_GOOGLE_TAG` constant, the `GoogleTag()` function, the conditional render `{ENABLE_GOOGLE_TAG ? <GoogleTag /> : null}`, and the `ReactElement` import if no longer used; also remove the `Script` import if unused after the move
- [ ] write a layout smoke test asserting the gtag id string is referenced in `src/app/[lang]/layout.tsx` source (a static-text assertion is enough — we don't need to render the layout in a test environment)
- [ ] run `npx jest` for any layout-touching tests + `npm run typecheck` + `npm run lint` — all must pass before next task

### Task 5: Verify acceptance criteria
- [ ] verify all requirements from Overview are implemented (banner shows on first visit; Accept upgrades consent; Decline persists; revisit with stored choice skips banner; gtag default is denied; Umami unaffected)
- [ ] verify edge cases are handled (SSR safety, missing `window.gtag`, malformed localStorage, both `be` and `nl` render correctly)
- [ ] verify rendered output matches the provided designs at mobile and desktop breakpoints
- [ ] run `npm run test` (full suite) — must pass
- [ ] run `npm run lint` — all issues fixed
- [ ] run `npm run typecheck` — clean
- [ ] confirm test coverage on new code (`src/lib/consent.ts`, `src/components/consent/banner.tsx`) ≥ 80%

### Task 6: Update CLAUDE.md
- [ ] add a short subsection under "Architectural Decisions (Non-Obvious)" titled "Consent Mode v2 + cookie banner": one paragraph covering where the banner lives (`src/app/[lang]/layout.tsx`), the localStorage key (`mara_consent`), and the rule that gtag conversions are gated by Consent Mode (do not bypass)
- [ ] add Pitfall: "Cookie banner only shows under `[lang]` routes; `/studio` (route group) is intentionally not gated and intentionally has no gtag"

## Technical Details

**Consent Mode v2 signals controlled:**
- `ad_storage` — Google Ads cookies
- `ad_user_data` — sending user data to Google for ads
- `ad_personalization` — for remarketing

`analytics_storage` is left untouched (we don't use GA4; Umami is independent and cookieless).

**localStorage shape:**
```json
{ "choice": "granted", "timestamp": 1761523200000 }
```

**Mount order in `src/app/[lang]/layout.tsx`:**
1. Inline `<Script id="gtag-consent-default">` — runs first, sets defaults to denied + minimal gtag scaffolding
2. `<Script async src=".../gtag/js?id=AW-...">` — loads gtag.js
3. `<Script id="gtm-conversion-reporter">` — defines `window.gtag_report_conversion`
4. `<ConsentBanner lang={lang} />` — renders client-side, reads localStorage, possibly upgrades consent

**Why default-denied must be inline and pre-script:**
Google Consent Mode requires the default state to be set **before** gtag.js loads, otherwise tag fires uncontrolled until the script catches the update. Using `next/script` with `strategy="beforeInteractive"` on an inline script achieves this; the gtag.js `<Script>` defaults to `afterInteractive`.

**Why the banner is a sibling of `{children}`, not inside it:**
Same reasoning as the mobile tab bar (see CLAUDE.md "Mobile navigation"): keeps it pinned and outside ISR-cached server-rendered tree, so navigation between event pages doesn't unmount it.

## Post-Completion

*Items requiring manual intervention or external systems — informational only*

**Designs (blocking Task 3):**
- Designs for the banner (mobile + desktop) will be provided separately before Task 3 starts. Until they arrive, work on Tasks 1, 2, 4, 6 in any order; Task 5 (verification) runs last.

**Manual verification:**
- Open the live site in a fresh browser profile (no localStorage). Confirm banner appears and matches the design at narrow + wide widths.
- Click Accept. Reload. Confirm banner does not reappear and that DevTools → Application → localStorage shows `mara_consent` with `"choice": "granted"`.
- In a second fresh profile click Decline. Reload. Confirm banner does not reappear.
- In DevTools → Network, filter for `googletagmanager.com`. Confirm gtag.js loads on every page under `/be/...` and `/nl/...`. Confirm it does **not** load on `/studio`.
- Switch to `/nl/...` and confirm Dutch copy renders. Switch to `/be/...` and confirm Belarusian copy renders.

**Google Ads side (separate from this plan):**
- In Google Ads (current account `998-367-8246`), set up a Google tag and a Conversion action for ticket clicks.
- Update the `AW-XXXXXXXXXX` placeholder in `src/app/[lang]/layout.tsx` (and matching script src) with the real account ID.
- Set the per-event GTM field in Sanity Studio to `AW-XXXXXXXXXX/<conversion-label>`.
- Visit a live event page once to let Google detect the tag (≤ 24h).

**Deployment:**
- Merge → Vercel auto-deploys. No env var changes needed.
- After deploy, monitor Google Ads "Conversions → Diagnostics" for tag-detection status.

**External system updates (if/when applicable):**
- If a future preferences UI is added (so users can change their mind), it would live as a new client component reading/writing the same `mara_consent` key and calling `applyConsent` accordingly. Not in scope here.