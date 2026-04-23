# Mobile bottom tab bar + frosted-glass header (Plan 2 of 3)

## Overview

The MARA design-system refresh replaces the current mobile hamburger drawer with a **bottom tab bar** — a 5-tab fixed element pinned to the viewport bottom. This is the pattern the user selected (pattern B) after iterating through hamburger / tab bar / side drawer options in the Claude Design chat. This plan also adds the **frosted-glass blur** to the mobile sticky header so page content stays legible as it scrolls under the header (the chat explicitly flipped from "non-sticky" back to "sticky with blur" after observing text collision with the iOS dynamic island).

Covers punch-list items **#6** and **#7**.

Problems solved:
- Current mobile nav (`MobileMenu`) is a right-slide drawer triggered by a hamburger. Discovery is poor; primary actions require two taps.
- Current mobile header is `sticky` with an opaque `bg-white-shade` but no blur, so when the user scrolls, text briefly sits directly behind the header before disappearing — looks unfinished.

Information architecture (decided upfront):
- **5 tabs**: Home · Events · Info · About · Donate.
- **Donate** tab uses the rainbow gradient (in Plan 2 we keep the existing `bg-beautiful-button` class; Plan 3 replaces the gradient's *value* with the seamless conic version — decoupled).
- **Info** tab routes to a hub page listing Refugees-bot and Vreemdelingenpaspoort.
- **Vacatures** (`vacancies`) moves under About — accessible via a link section at the bottom of `/[lang]/about-us`.
- **Jaarverslagen** (`reports`) also moves under About — same link section.
- **Join-us** is not a primary tab; the big `bg-beautiful-button` Join CTA is retired from the chrome (the chats explicitly reserve the rainbow CTA for donation surfaces, not for Join). Join-us page remains reachable via an About link.

Out of scope:
- Donate rainbow *visual* rewrite (seamless conic + `@property --angle`) — deferred to Plan 3 (#2, #12). Plan 2 leaves the existing Tailwind class intact; when Plan 3 updates the `--background-image-beautiful-button` token, every consumer (including the new Donate tab) picks it up automatically.
- Desktop nav — unchanged in this plan.
- Wobble removal on non-mobile surfaces — deferred to Plan 3 (#1).

## Context (from discovery)

Files involved:

- `src/components/menu/menu.tsx` — breakpoint switch between `DesktopMenu` and `MobileMenu` using a `width < md` check (this pattern is client-side and flickers on first paint). The tab bar replacement must not rely on this switch: the bar is rendered unconditionally and hidden via `md:hidden`.
- `src/components/menu/mobile/mobileMenu.tsx` — current drawer implementation (105 lines). To be deleted once the tab bar lands.
- `src/components/header/header.tsx:11-12` — `sticky md:static flex items-center bg-white-shade ...`. This is where the frosted-glass blur goes.
- `src/components/header/logo.tsx` — current desktop-or-mobile logo. The tab bar pattern allows the mobile header to simplify (logo + language toggle, no hamburger), but the existing logo is already fine at `w-36` — no resize needed.
- `src/components/language-selector.tsx` — already a toggle, already no flags. Stays on the header on mobile too (small enough).
- `src/app/[lang]/layout.tsx` — applies a root wrapper around `{children}`. Page content must gain bottom padding on mobile so it doesn't hide under the tab bar. The simplest place is here, scoped to `md:pb-0` so desktop is untouched.
- `src/app/[lang]/about-us/page.tsx` — needs a "Related" link section at the bottom pointing to `/vacancies` and `/reports/...`. Minimal addition.
- `src/app/[lang]/info/page.tsx` — **does not exist yet**. Must be created as a hub listing the two items that live inside Info (refugees-bot, alien-passport).
- `src/app/i18n/locales/{be,nl}/common.json` — has keys `about-us`, `events`, `useful-info`, `donate-us`, `alien-passport`, `refugees-bot`, `reports`, `vacancies`. Missing a dedicated "home" label for the tab bar — add.
- `src/components/types.ts` — `Lang` enum lives here; may also be a good place for a small `TabKey` type.

Related patterns:
- Active-tab detection: `usePathname()` from `next/navigation` returns the current route; compare against `/[lang]/<segment>` to mark the tab active. Home is matched by equality (pathname === `/${lang}`), others by `startsWith`.
- FontAwesome 6 solid icons are already in use (`src/components/dropdown.tsx` uses `faChevronDown`). Use the same library for tab icons: `faHouse`, `faCalendarDays`, `faCircleInfo`, `faUsers`, `faHandHoldingDollar` (or `faHeart`).
- Tailwind 4 `md` breakpoint = 768px (default). Tab bar shown below `md`, header-nav (`DesktopMenu`) shown at and above `md`.
- Safe-area support: `env(safe-area-inset-bottom)` for devices with home indicators. Use Tailwind arbitrary values (`pb-[env(safe-area-inset-bottom)]`) or a single CSS class in `globals.css`.

Design-system reference:
- `mara-design-system/project/README.md` visual-foundations section confirms: "Header is `sticky` on mobile and `static` on desktop — an interesting inversion of the usual pattern. Always at `bg-white-shade` (not pure white)." The refresh adds `backdrop-filter: blur(16px)` + translucent bg.
- Chat iteration (chat1.md 1354–1430): user rejected "non-sticky", then approved sticky + `backdrop-filter: blur(16px)` with a translucent background. Duration: `position: sticky; top: 0; backdrop-filter: blur(16px)`.
- Chat iteration (chat1.md 976–1031): user chose bottom tab bar (pattern B) over hamburger/drawer. Tab bar must live **outside** the page-scroll container (chat1.md 1216–1244: "the tab bar must live OUTSIDE the scroll container... the phone frame has two siblings: a scrollable body and the tab bar, pinned to the bottom of the frame so content scrolls underneath it"). In Next.js this means the tab bar is a sibling of `{children}` inside the layout, not nested.
- Tab labels and colors (chat1.md 1602–1643): inactive grey `#808080`, active brand red `#ED1C24`, Roboto 500, labels 10–12px.

Dependencies / external:
- No new npm packages. FontAwesome is already installed.
- No changes to Clerk, Stripe, Sanity integrations.

## Development Approach

- **Testing approach**: Regular (code first, then tests).
  - Component tests for the new `TabBar` component verifying: correct number of tabs, active-tab detection by pathname, accessible labels, and click-through to each route.
  - No full e2e tests (project has no Playwright). Manual mobile-viewport smoke-test at Post-Completion.
  - Header blur is CSS-only; no unit test. Verified by browser spot-check.
- Complete each task fully before moving to the next.
- **CRITICAL: every task that changes behavior ships with tests in the same task.** Pure CSS additions (backdrop blur, bottom padding utility) are verified by build + visual spot-check and that fact is noted per-task.
- Maintain backward compatibility: desktop nav unchanged; routing unchanged; i18n keys added, not renamed.

## Testing Strategy

- **Unit tests**:
  - `src/components/menu/mobile/__tests__/tabBar.test.tsx` — renders 5 tabs; active tab for each pathname (home, events, info, about, donate); aria-current set correctly; each tab links to `/${lang}/${segment}`.
  - `src/components/header/__tests__/header.test.tsx` — asserts the header wrapper has the mobile blur / translucency classes (a shape assertion, not a visual one).
  - `src/app/[lang]/info/__tests__/page.test.tsx` — renders a list of links to refugees-bot and alien-passport.
- **Build verification**: `npm run typecheck && npm run lint && npm run build`.
- **E2E tests**: none — project has no Playwright/Cypress setup.
- **Manual mobile verification** (Post-Completion): scroll a long page (home), confirm header frosts without shimmering, tab bar stays pinned, active tab follows navigation.

## Progress Tracking

- Mark completed items with `[x]` immediately when done.
- Add newly discovered tasks with ➕ prefix.
- Document issues/blockers with ⚠️ prefix.
- Update plan if implementation deviates from original scope.

## What Goes Where

- **Implementation Steps** (`[ ]` checkboxes): component creation, route/page additions, layout wiring, i18n keys, tests, grep-verifiable cleanup.
- **Post-Completion** (no checkboxes): manual mobile device smoke-test, Lighthouse a11y re-run, confirmation that `/info` content is appropriate (not a coding task).

## Implementation Steps

### Task 1: Add i18n keys and minimal info-hub page

- [ ] add i18n key `"home": "Галоўная"` to `src/app/i18n/locales/be/common.json`; `"home": "Home"` to `src/app/i18n/locales/nl/common.json`.
- [ ] add i18n key `"info": "Інфа"` (be) / `"info": "Info"` (nl) for the short tab label (different from the longer `useful-info` used elsewhere in nav).
- [ ] create `src/app/[lang]/info/page.tsx` — a server component that: awaits `params`, validates `lang`, renders an H1 (`t('useful-info')`), a short paragraph intro (use existing copy or a single sentence), and a list of two card-link items: Vreemdelingenpaspoort (`/[lang]/alien-passport`) and Refugees-bot (external or TBD — check existing desktop menu for the current URL before writing).
- [ ] verify the route renders at `http://localhost:3000/be/info` and `/nl/info` via `npm run dev`.
- [ ] write a minimal Jest test `src/app/[lang]/info/__tests__/page.test.tsx` asserting the page renders both links.
- [ ] run tests — must pass before Task 2.

### Task 2: Build the TabBar component

- [ ] create `src/components/menu/mobile/tabBar.tsx` (client component — needs `usePathname`).
- [ ] component signature: `export function TabBar({ lang }: { lang: Lang }) { ... }`.
- [ ] define a local constant array of 5 tabs: each with `{ key, href, label, icon }`:
  - home → `/${lang}`, label `t('home')`, icon `faHouse`
  - events → `/${lang}/events`, label `t('events')`, icon `faCalendarDays`
  - info → `/${lang}/info`, label `t('info')`, icon `faCircleInfo`
  - about → `/${lang}/about-us`, label `t('about-us')`, icon `faUsers`
  - donate → `/${lang}/donate`, label `t('donate-us')`, icon `faHandHoldingDollar`
- [ ] active-tab logic: `usePathname()` → strip `/${lang}` prefix → match against each tab's segment. Home matches only when the remaining path is empty or `/`. Other tabs match `startsWith(tab.segment)`.
- [ ] render structure:
  - outer `<nav aria-label="primary">` fixed to viewport bottom, `md:hidden`, `bg-white-shade`, `shadow-tb-xl`, `z-40`.
  - bottom padding equal to `env(safe-area-inset-bottom, 0)` — use arbitrary Tailwind value `pb-[env(safe-area-inset-bottom,0px)]` or add a utility in `globals.css`.
  - inside, `<ul class="flex items-stretch justify-between">` with 5 `<li>` children.
  - each `<li>` contains a `<Link>` with `aria-current={active ? 'page' : undefined}`, `className` swapping `text-primary` (active) vs `text-grey` (inactive), a column layout of icon (24px) + label (Roboto 500, 11px, one line).
  - Donate tab adds a rainbow background on the icon pill: keep an inner `<span>` styled with the existing `bg-beautiful-button` Tailwind class; the whole tab does not go rainbow (only the icon chip), so inactive Donate still reads as part of the bar family.
- [ ] height target: 64px + safe-area; use `min-h-[64px]` and ensure touch targets are ≥44px.
- [ ] no transform animation on active (matches chat's "direction from motion, color from surface" principle for spinner but equally applies here — no bouncing tabs).
- [ ] write `src/components/menu/mobile/__tests__/tabBar.test.tsx`:
  - renders exactly 5 tabs.
  - for each of 5 pathnames (home, events, info, about, donate), asserts only the matching tab has `aria-current="page"`.
  - asserts each tab's `href` starts with `/${lang}/`.
- [ ] run tests — must pass before Task 3.

### Task 3: Wire TabBar into the layout and retire MobileMenu

- [ ] edit `src/components/menu/menu.tsx`: remove the `width < md` client-side switch. Return `<div className={className}><DesktopMenu lang={lang} className="hidden md:flex" /><LanguageSelector lang={lang} className="md:hidden" /></div>` (or similar — keep the desktop menu hidden below `md`, keep the language selector visible on mobile). No hamburger. No drawer.
- [ ] edit `src/app/[lang]/layout.tsx` (or the root layout, whichever wraps every localized page): render `<TabBar lang={lang} />` as a sibling of `{children}`. Add bottom padding to the `{children}` wrapper: `pb-20 md:pb-0` so content isn't covered by the tab bar on mobile.
- [ ] delete `src/components/menu/mobile/mobileMenu.tsx` entirely. Remove the import from `src/components/menu/menu.tsx`.
- [ ] grep for any lingering imports of `MobileMenu` — expect zero hits.
- [ ] update/remove any snapshot tests that reference the old drawer.
- [ ] write `src/components/menu/__tests__/menu.test.tsx` (or update existing) asserting the rendered menu contains the `DesktopMenu` and the `LanguageSelector` but no hamburger button.
- [ ] run `npm run typecheck && npm run lint && npm run build`.
- [ ] run tests — must pass before Task 4.

### Task 4: Frosted-glass mobile header

- [ ] edit `src/components/header/header.tsx:11-12`: append `backdrop-blur-md bg-white-shade/80 md:bg-white-shade` to the header's className (keep existing `sticky md:static px-3 py-2 md:py-4 lg:py-8 top-0 z-50`).
- [ ] verify on mobile: scrolling a long page (home) shows blurred content peeking through the header area.
- [ ] write a shape assertion in `src/components/header/__tests__/header.test.tsx` confirming the rendered header contains classes `backdrop-blur-md` and `bg-white-shade/80`.
- [ ] run `npm run typecheck && npm run lint` — must pass.
- [ ] run tests — must pass before Task 5.

### Task 5: Add "Related" section on About page (for Vacatures + Jaarverslagen)

- [ ] open `src/app/[lang]/about-us/page.tsx` and append a new section at the bottom: an H2 (`t('related', …)` — add this i18n key too, values `"Таксама"` / `"Ook interessant"`) and two `<Link>` items pointing to `/[lang]/vacancies` and to the latest-year reports page (e.g. `/[lang]/reports/2025` — verify current URL scheme in the existing mobile menu before finalizing).
- [ ] style using the existing `Card` component from `src/components/card.tsx` so the styling matches the rest of About.
- [ ] add i18n keys `related` and, if missing, `vacancies-link-description` / `reports-link-description` for short one-line card descriptions.
- [ ] write `src/app/[lang]/about-us/__tests__/page.test.tsx` (or extend the existing test if present) confirming the Related section and both links render.
- [ ] run tests — must pass before Task 6.

### Task 6: Verify acceptance criteria and full scope

- [ ] verify 5 tabs visible on mobile viewport at every top-level route.
- [ ] verify each tab navigates correctly and the correct tab is highlighted.
- [ ] verify mobile header stays pinned and blurs content underneath.
- [ ] verify `/info` hub lists Vreemdelingenpaspoort and Refugees-bot.
- [ ] verify About page has a Related section linking Vacatures + Jaarverslagen.
- [ ] verify desktop nav is visually unchanged (hidden tab bar, `DesktopMenu` renders).
- [ ] verify no `MobileMenu` references remain: `grep -rn "MobileMenu" src` returns zero.
- [ ] run full test suite: `npm test`.
- [ ] run linter: `npm run lint` — no errors.
- [ ] run `npm run build` — must succeed.

### Task 7: Update project CLAUDE.md with mobile nav pattern

- [ ] in `CLAUDE.md`, under "Architectural Decisions", add a one-paragraph note: "Mobile navigation uses a 5-tab bottom tab bar (`src/components/menu/mobile/tabBar.tsx`) rendered at all viewports below `md` and hidden at and above. Desktop renders `DesktopMenu` in the header. The tab bar lives as a sibling of `{children}` in `src/app/[lang]/layout.tsx` so it stays pinned while content scrolls underneath; content gets `pb-20 md:pb-0` to clear the bar." Keep it short.
- [ ] no test needed (documentation only).

## Technical Details

- **Active-tab matching**: `usePathname()` returns a string like `/be/events/some-slug`. After stripping the `/${lang}` prefix, a helper returns one of `home | events | info | about-us | donate` (or `null`). The helper is pure and testable:
  ```ts
  function activeTab(pathname: string, lang: Lang): TabKey | null {
    const path = pathname.replace(new RegExp(`^/${lang}`), '');
    if (path === '' || path === '/') return 'home';
    if (path.startsWith('/events')) return 'events';
    if (path.startsWith('/info') || path.startsWith('/alien-passport')) return 'info';
    if (path.startsWith('/about-us') || path.startsWith('/vacancies') || path.startsWith('/reports')) return 'about';
    if (path.startsWith('/donate')) return 'donate';
    return null;
  }
  ```
  Note the two "umbrella" tabs: Info owns `/info` and `/alien-passport`; About owns `/about-us`, `/vacancies`, `/reports/**`. This reflects the IA decision and keeps the correct tab highlighted when a user lands on a nested page.
- **Donate tab rainbow**: set a fixed-size inner `<span class="bg-beautiful-button rounded-full w-10 h-10 flex items-center justify-center">` around the icon. Using the existing token means Plan 3 rewrites the value once and the Donate tab inherits the new conic gradient with zero extra work.
- **Bottom padding**: `pb-20` (80px) on the main content wrapper accommodates a 64px tab bar + safe-area. Tune in browser if there is visible overlap.
- **`z-index` stacking**: tab bar `z-40`, header `z-50`, modal overlays (if any) `z-60+`. Align with existing values (header already uses `z-50`).
- **Accessibility**: tab bar wrapped in `<nav aria-label="primary">`, each tab `<Link>` carries `aria-current="page"` when active. Visible focus ring not suppressed. Tab bar height ≥ 48px for touch targets.

## Post-Completion

*Items requiring manual intervention — no checkboxes.*

**Manual verification**:
- Real mobile device smoke-test (iOS Safari + Android Chrome): tab bar pinned across all screens, safe-area padding correct on iPhones with home indicator, header blur visible when scrolling.
- Lighthouse re-run on mobile after changes: accessibility must not regress.
- Confirm the copy on `/info` matches MARA's voice (the page is new; hand-off the copy review to the content owner).

**External system updates**: none.

**Follow-on plans**:
- Plan 3: `docs/plans/2026-04-23-design-refresh.md` — the eight chat-driven items. Once Plan 3 rewrites `--background-image-beautiful-button` to the seamless conic gradient, the Donate tab's rainbow upgrades automatically.

**Open questions surfaced during IA design — resolve before Task 1**:
- Refugees-bot currently lives as an item inside the desktop `DesktopMenu` dropdown. Does it route to an internal page or to an external URL? Reuse the exact same URL in `/info`.
- About-page Related section: which report year is "latest"? At plan-write time the codebase references 2022–2025 in `mobileMenu.tsx`; pick the highest year that has content published.
