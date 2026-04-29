# Cookie Consent Banner

## Overview
A custom GDPR-compliant cookie consent banner that gates the existing Google Ads `gtag.js` integration via Google Consent Mode v2. Today `ENABLE_GOOGLE_TAG = false` in `src/app/layout.tsx` — the tag is fully wired but disabled because the site has no consent flow. After this work the tag can be enabled in production while staying compliant for EU/Netherlands visitors.

**Behavior:**
- Banner appears at the bottom on first visit for all users (always-on, no region detection).
- gtag scripts load on every `[lang]` route with all consent signals **defaulted to `denied`**.
- On **Accept** → `gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' })` and persist choice in `localStorage`.
- On **Decline** → consent stays denied; persist choice so banner doesn't reappear automatically.
- On revisit with a stored choice → banner does not auto-show. A small **"Cookies" reopen pill** is shown instead (bottom-left); clicking it re-opens the banner so the user can change their mind. If previously granted, consent is immediately re-upgraded on mount regardless of pill interaction.
- Umami stays as-is (cookieless, no consent required).

**Visual design:** designs delivered in `cookie_consent/` (HTML preview + `styles.css` + `colors_and_type.css` + `Variants.jsx`). Translate the design into Tailwind utilities — do **not** import the design's CSS. The design files use raw CSS custom properties; the project equivalents live in `src/components/globals.css` `@theme` and `src/theme/tokens.ts`. Final-source-of-truth for any color/shadow/radius is the project's `@theme`, not the standalone design files.

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
- [x] create `src/lib/consent.ts` exporting: `ConsentChoice = 'granted' | 'denied'`, `readConsent(): ConsentChoice | null`, `writeConsent(choice: ConsentChoice): void`, `applyConsent(choice: ConsentChoice): void` (calls `window.gtag('consent', 'update', { ad_storage, ad_user_data, ad_personalization })` mapping granted/denied uniformly across the three signals)
- [x] guard against SSR (`typeof window === 'undefined'`) and missing `window.gtag` (no-op gracefully)
- [x] use localStorage key `mara_consent` storing `{ choice: ConsentChoice, timestamp: number }` JSON
- [x] write tests `src/lib/__tests__/consent.test.ts`: success cases (read after write returns same value, applyConsent calls gtag with correct args)
- [x] write tests for error/edge cases (read with no key returns null, read with malformed JSON returns null and clears the key, applyConsent without window.gtag is a no-op)
- [x] run `npx jest src/lib/__tests__/consent.test.ts` — must pass before next task

### Task 2: Consent translation namespace
- [x] create `src/app/i18n/locales/be/consent.json` with keys: `title`, `body`, `accept`, `decline`, `aria.region` (Belarusian copy — use placeholder copy if final wording is part of the design deliverable)
- [x] create `src/app/i18n/locales/nl/consent.json` with the same keys (Dutch copy)
- [x] keep copy short (≤ 2 sentences in `body`) and mention what data goes where: Google Ads measures conversions; Umami stays cookieless; user can decline
- [x] write test `src/app/i18n/locales/__tests__/consent.test.ts` that imports both JSON files and asserts each required key is a non-empty string
- [x] run `npx jest src/app/i18n/locales/__tests__/consent.test.ts` — must pass before next task

### Task 3: `ConsentBanner` client component (`src/components/consent/banner.tsx`)

Designs landed at `cookie_consent/` (April 2026). The Task 3 checkboxes below were previously marked `[x] (deferred)` — they have been re-opened to `[ ]` because real implementation work is required. The existing `banner.tsx` keeps `applyStoredConsent()` and the headless `useEffect` re-apply path; the visible UI work below is added on top.

#### Design summary (translated from `cookie_consent/styles.css`)

| Element | Desktop (`≥ md`) | Mobile (`< md`) |
|---|---|---|
| Banner container | fixed bottom-left card, width `360px`, padding `20px`, `bg-white`, `rounded-md` (6px), `shadow-2xl`, `z-40` | full-width sheet with `12px` gutters left/right, padding `18px`/`16px`, same radius/shadow, `z-50` (above any future overlays) |
| Bottom offset | `bottom: 18px` | see "Open question 3" below — the design assumed a 5-tab bottom bar that does not exist in the codebase |
| Title (`title`) | weight 500, size 16px, margin-bottom 6px | same |
| Body (`body`) | weight 300, size 14px, line-height 1.55, margin-bottom 14px | same |
| Privacy link (`privacy`) | inline-left in row, size 13px, muted color (`text-grey`), underline on hover transitions to primary | stacks above buttons on its own line |
| Buttons row (`actions`) | inline-right in same row as privacy link, gap 10px | 2-column equal-width grid below privacy link, gap 10px, full-width buttons |
| Decline button | white bg, ink text, `shadow-lg`, on hover `shadow-xl`, no transform | same |
| Accept button | `bg-primary`, white text, otherwise identical | same |
| Mount animation | fade + translate-y 8px → 0 over 350ms ease | same |
| Reopen pill (post-dismiss) | `bottom-left 18px`, white pill, `shadow-lg`, small red dot + "Cookies" label, weight 500 size 12px | `bottom-left 12px` (or matched to banner's mobile gutter) |

Buttons in the design use **shadow-only hover, no `translate-y`** — this is intentionally quieter than the project's standard `<Button>` component (which transforms on hover per CLAUDE.md). **Use custom `<button>` markup** with Tailwind utilities; do not reuse `@/components/button`. Document this deviation in CLAUDE.md when Task 6 is updated.

#### Open questions (resolve before / during implementation)

1. **Privacy link target.** The design includes a "Privacy policy" link, but the project has no `/[lang]/privacy` route. Options: (a) add a placeholder page (`src/app/[lang]/privacy/page.tsx`) — out of scope for this banner work but quick; (b) ship the banner without the link and add it in a follow-up; (c) link to an external policy URL. **Recommend (b)** — keep the i18n key + DOM slot wired, but render the link only when a `privacyHref` resolves to a non-empty value, and leave it empty for now.
2. **Body copy mentions Meta.** Design copy: "Мы лічым канверсію рэкламы, якую запускаем у Google і Meta." The codebase only wires Google Consent Mode v2 — no Meta Pixel exists. Either drop "Meta" from the copy, or accept that Meta Pixel will be added in a separate ticket and the banner is forward-compatible. **Recommend dropping Meta from the copy** for now — keep the body to "Google" only — and revise if/when Meta Pixel lands.
3. **Mobile bottom offset.** Design shows `bottom: 92px` to clear a 5-tab bottom nav. The project does not have one (`mobileMenu.tsx` is a hamburger drawer). **Use `bottom: 16px`** with `pb-[env(safe-area-inset-bottom)]` on iOS. If a bottom tab bar is added later, revisit.

#### Implementation steps

- [x] add new translation keys to `src/app/i18n/locales/{be,nl}/consent.json`: `privacy` and `reopen` (label for the reopen pill, e.g. "Cookies"). Update existing `body` copy per Open Question 2 (drop "Meta" unless instructed otherwise). Suggested copy:
  - `be.title`: "Cookies для рэкламы"
  - `be.body`: "Мы лічым канверсію рэкламы, якую запускаем у Google. Іншага мы не адсочваем."
  - `be.accept`: "Прыняць"
  - `be.decline`: "Адхіліць"
  - `be.privacy`: "Палітыка прыватнасці"
  - `be.reopen`: "Cookies"
  - `nl.title`: "Cookies voor advertenties"
  - `nl.body`: "We meten conversies van advertenties die we op Google laten lopen. Verder volgen we niets."
  - `nl.accept`: "Accepteren"
  - `nl.decline`: "Weigeren"
  - `nl.privacy`: "Privacybeleid"
  - `nl.reopen`: "Cookies"
- [x] update `src/app/i18n/locales/__tests__/consent.test.ts` to assert the new keys (`privacy`, `reopen`) are non-empty in both locales
- [x] in `src/components/consent/banner.tsx`, replace the headless `null` return with a real component. State machine:
  - `'hidden'` (initial when stored choice exists) → reopen pill is visible
  - `'visible'` (initial when no stored choice, OR user clicks reopen pill) → banner is visible
  - keep `applyStoredConsent()` mount-time re-apply unchanged
- [x] preserve the exported `applyStoredConsent` symbol — Task 1's tests cover it; do not break that contract
- [x] banner DOM (rendered when `state === 'visible'`):
  - `<section role="region" aria-label={t('aria.region')} class="fixed bg-white rounded-md shadow-2xl z-40 ...">`
  - title `<h3>` with `t('title')`, classes for weight 500 size 16px
  - body `<p>` with `t('body')`, classes for weight 300 size 14px line-height 1.55
  - row `<div>` containing privacy link (rendered only if `privacyHref` is non-empty) and the two action buttons
  - desktop: `md:left-[18px] md:bottom-[18px] md:w-[360px] md:p-5` and `<md:` mobile sheet sizing
  - mobile: `left-3 right-3 bottom-4 p-[18px] pb-[env(safe-area-inset-bottom)]` (per Open Question 3)
- [x] reopen pill DOM (rendered when `state === 'hidden'` AND a stored choice exists):
  - `<button class="fixed bottom-[18px] left-[18px] inline-flex items-center gap-2 bg-white rounded-full shadow-lg px-3 py-2 text-grey text-xs font-medium ...">`
  - small red dot `<span class="w-2 h-2 rounded-full bg-primary">`
  - label `t('reopen')`
- [x] custom button markup (do not use `@/components/button`):
  - Decline (ghost): `bg-white text-black-tint shadow-lg hover:shadow-xl active:shadow-2xl rounded-md px-4 py-2.5 text-sm transition-shadow font-normal`
  - Accept (primary): same shape, `bg-primary text-white`
  - **no transform** on hover/active — design is intentionally quieter than the standard project button
- [x] mount animation: add `animation-cc-in` keyframes to `src/components/globals.css` (fade + translate-y 8px → 0, 350ms ease both) OR inline via Tailwind `animate-[…]` arbitrary value if simpler. Apply to the banner only on visible-state mounts, not to the reopen pill
- [x] handlers:
  - `onAccept` → `writeConsent('granted')` + `applyConsent('granted')` + setState `'hidden'`
  - `onDecline` → `writeConsent('denied')` + setState `'hidden'` (no gtag call needed; default-denied already in effect)
  - `onReopen` → setState `'visible'`
- [x] a11y:
  - banner: `role="region"` + `aria-label={t('aria.region')}`
  - both action buttons keyboard-reachable; no focus trap (non-modal)
  - reopen pill: `aria-label={t('reopen')}` (label text alone is sufficient since it's just "Cookies")
  - ensure tab order: privacy link → Decline → Accept (matches reading order on desktop; mobile stacks naturally)
- [x] write tests `src/components/consent/__tests__/banner.test.tsx` following the project's Jest pattern (`@jest/globals`, direct functional invocation, no React Testing Library — see `button.test.tsx`):
  - rendered tree shape for `'visible'`, `'hidden'-with-stored-choice`, and `'hidden'-no-stored-choice` states
  - `onAccept`, `onDecline`, `onReopen` handlers (extract handlers as named functions or test via the helpers from Task 1)
  - assertion that `gtag('consent', 'update', …)` is **only** called on Accept, never on Decline or Reopen
  - `localStorage` + `window.gtag` stubbed via `jest.spyOn` / global override per Task 1's test pattern
- [x] run `npx jest src/components/consent/__tests__/banner.test.tsx src/app/i18n/locales/__tests__/consent.test.ts` — both must pass
- [x] run `npm run lint && npm run typecheck` — must be clean before moving on

### Task 4: Wire gtag + banner into `src/app/[lang]/layout.tsx`
- [x] in `src/app/[lang]/layout.tsx`, add `next/script` imports and inline `<Script id="gtag-consent-default">` that runs **before** the gtag.js src loads, body: ```window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); gtag('js', new Date()); gtag('config', 'AW-XXXXXXXXXX');``` — replace placeholder with the real account ID once chosen (see Post-Completion) — used the existing real ID `AW-11125506805`, exported as `GOOGLE_ADS_TAG_ID`
- [x] add `<Script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX" />` after the inline default-consent block
- [x] preserve the existing `gtag_report_conversion` helper script (copied verbatim from current `src/app/layout.tsx:97–109`) so `event-article.tsx:65` keeps working unchanged
- [x] mount `<ConsentBanner lang={lang} />` as a sibling of `{children}` (alongside the mobile tab bar) — banner is currently a headless stub (Task 3 deferred awaiting designs); it re-applies a previously granted choice on mount and renders no UI yet
- [x] in `src/app/layout.tsx`, **delete** the `ENABLE_GOOGLE_TAG` constant, the `GoogleTag()` function, the conditional render `{ENABLE_GOOGLE_TAG ? <GoogleTag /> : null}`, and the `ReactElement` import if no longer used; also remove the `Script` import if unused after the move (`Script` kept — still used by `<Script id="website-jsonld">` and the Umami script)
- [x] write a layout smoke test asserting the gtag id string is referenced in `src/app/[lang]/layout.tsx` source (a static-text assertion is enough — we don't need to render the layout in a test environment) — added in `src/app/[lang]/__tests__/layout.test.tsx`
- [x] run `npx jest` for any layout-touching tests + `npm run typecheck` + `npm run lint` — all must pass before next task

### Task 5: Verify acceptance criteria
- [x] verify all requirements from Overview are implemented (banner shows on first visit; Accept upgrades consent; Decline persists; revisit with stored choice skips banner; gtag default is denied; Umami unaffected) — gtag default-denied is wired in `[lang]/layout.tsx`; `applyStoredConsent` re-upgrades on revisit; persistence + accept/decline upgrade paths covered by `consent.ts` tests; visible banner UI (first-visit show / Accept / Decline buttons) is gated on Task 3 (designs)
- [x] verify edge cases are handled (SSR safety, missing `window.gtag`, malformed localStorage, both `be` and `nl` render correctly) — covered by `src/lib/__tests__/consent.test.ts` (SSR, missing gtag, malformed JSON, unknown choice value) and `src/app/i18n/locales/__tests__/consent.test.ts` (be + nl key presence)
- [x] verify rendered output matches the designs in `cookie_consent/` at mobile (`< md`) and desktop (`≥ md`) breakpoints — manual visual check (skipped - not automatable in CI; class-level assertions on banner/pill positioning + button styling are covered in `banner.test.tsx`)
- [x] verify reopen pill flow: dismiss banner → pill appears → click pill → banner re-appears → Accept/Decline still works — manual interaction check (skipped - not automatable in CI; the dispatch logic is covered by `banner-component.test.tsx` tests for state=visible, state=hidden+stored, and the reopen-pill onClick → setState('visible') wiring)
- [x] re-run `npm run test` (full suite) — 127/127 passing
- [x] re-run `npm run lint` — clean (0 errors, only pre-existing warnings)
- [x] re-run `npm run typecheck` — clean
- [x] re-confirm test coverage on `src/components/consent/banner.tsx` ≥ 80% after the visible-UI work lands — now at 100% statements/branches/functions/lines (added `banner-component.test.tsx` covering the hooks-using component body)

### Task 6: Update CLAUDE.md
- [x] add a short subsection under "Architectural Decisions (Non-Obvious)" titled "Consent Mode v2 + cookie banner": one paragraph covering where the banner lives (`src/app/[lang]/layout.tsx`), the localStorage key (`mara_consent`), and the rule that gtag conversions are gated by Consent Mode (do not bypass)
- [x] add Pitfall: "Cookie banner only shows under `[lang]` routes; `/studio` (route group) is intentionally not gated and intentionally has no gtag"
- [ ] **after Task 3 ships**: revise the "Consent Mode v2 + cookie banner" subsection to remove the "Today the banner returns `null`" paragraph (it will no longer be true). Replace with a description of the visible banner + reopen pill state machine. Note the **intentional deviation** that consent banner buttons use shadow-only hover (no `translate-y`), unlike `src/components/button.tsx` which translates on hover.

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

**Designs:**
- Delivered (April 2026) at `cookie_consent/`: HTML preview, `styles.css`, `colors_and_type.css`, `Variants.jsx`. Used as the visual spec for Task 3 — translate to Tailwind utilities; do not import the design CSS into the app.

**Manual verification:**
- Open the live site in a fresh browser profile (no localStorage). Confirm banner appears bottom-left on desktop / full-width sheet on mobile and matches the design.
- Click Accept. Reload. Confirm banner does not auto-reappear, the **"Cookies" reopen pill** appears bottom-left, and DevTools → Application → localStorage shows `mara_consent` with `"choice": "granted"`.
- Click the reopen pill. Confirm the banner re-appears. Decline. Confirm pill returns and stored choice is now `"denied"`.
- In a second fresh profile click Decline directly. Reload. Confirm banner does not auto-reappear and the reopen pill is shown.
- In DevTools → Network, filter for `googletagmanager.com`. Confirm gtag.js loads on every page under `/be/...` and `/nl/...`. Confirm it does **not** load on `/studio`. Confirm the consent state in the Tag Assistant matches the user's choice.
- Switch to `/nl/...` and confirm Dutch copy renders. Switch to `/be/...` and confirm Belarusian copy renders. Verify the privacy link is either present (if Open Question 1 resolves to ship a target) or absent (if shipping without it).

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