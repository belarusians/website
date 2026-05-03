# Mobile bottom tab bar — re-aligned to `ui_kits/mobile/` (REDO)

## Source of truth: `ui_kits/mobile/`

**This plan does not invent visuals.** The mobile UI kit at `ui_kits/mobile/` is the single source of truth for layout, ordering, typography, color, spacing, and motion. Every implementation choice below traces back to a specific file in that directory.

| Topic | Authoritative reference |
|---|---|
| Tab bar markup + ordering | `ui_kits/mobile/Header.jsx` → `function TabBar` |
| Tab bar styling (colors, shadow, padding, dot pill) | `ui_kits/mobile/styles.css` → `.m-tabbar`, `.m-tabbar .donate-tab .dot[::before]` |
| Tab labels (NL + BE) | `ui_kits/mobile/Header.jsx` → `function labels` (`tabHome`, `tabEvents`, `tabDonate`, `tabHelp`, `tabInfo`) |
| Mobile header backdrop blur | `ui_kits/mobile/styles.css` → `.m-header` (`backdrop-filter: saturate(180%) blur(16px)`) |
| Conic rainbow values + animation | `ui_kits/mobile/styles.css` → `@property --m-angle`, `.m-tabbar .donate-tab .dot::before` (already shipped to `globals.css` as `bg-rainbow-spin`; reuse — do not duplicate) |
| Reachable screens | `ui_kits/mobile/Screens.jsx` (Events, About, Passport), `ui_kits/mobile/Home.jsx`, `ui_kits/mobile/Donate.jsx` |
| iOS home-indicator clearance | `ui_kits/mobile/styles.css` → `.m-tabbar { padding: 8px 4px 34px }` |

**Rule for the executor**: when in doubt, open the referenced file and copy. Do not adjust hex values, ordering, label text, or layout because "it looks better." If a value seems wrong, raise a ⚠️ in this plan and stop — do not improvise.

## Why this is a redo

The previous version of this plan (now overwritten) shipped a 5-tab bar before the mobile UI kit existed. That implementation diverged from the as-delivered design in eight visible ways (see "Diff vs. design" below). This plan re-aligns the live code to the kit. No part of the kit is up for re-design here; the kit was approved separately.

## Diff vs. design (what's wrong today and what needs to change)

| # | Aspect | Current (`src/components/menu/mobile/tabBar.tsx`) | Design (`ui_kits/mobile/`) | Action |
|---|---|---|---|---|
| 1 | Tab order | home, events, info, about, donate | home, events, **donate (center)**, passport, about | reorder array |
| 2 | Donate tab | regular cell with rainbow icon chip | center "raised" pill: 40×40 dot, `margin-top: -20px`, dark bg, conic rainbow ring, no top label icon | rebuild cell |
| 3 | Tab key 4 | `info` → `/info` (hub for passport + refugees-bot) | `passport` (label "Hulp"/"Дапам.") | retire `info` key, introduce `help` route + key |
| 4 | Tab labels (NL) | Home / Events / Info / About / Doneren | Home / **Agenda** / **Steun** / **Hulp** / **Info** | new i18n keys |
| 5 | Tab labels (BE) | Галоўная / Падзеі / Інфа / Pra nas / Падтр. | Дом / Падзеі / **Падтр.** / **Дапам.** / **Інфа** | new i18n keys |
| 6 | Header backdrop | `backdrop-blur-md bg-white-shade/80` | `rgba(246,246,246,0.85)` + `saturate(180%) blur(16px)` | retune classes |
| 7 | Tab bar bg/shadow | `bg-white-shade` + `border-t border-light-grey` | `#fff` + `box-shadow: 0 -1px 0 #EBEBEB, 0 -10px 20px rgb(0 0 0/.04)` | switch to bg-white + custom shadow utility |
| 8 | Bottom safe-area padding | `pb-[env(safe-area-inset-bottom,0px)]` (variable) | fixed `34px` | switch to `pb-[34px]` (the kit deliberately fixed this; do not re-introduce env() unless the design changes) |

## Information architecture (resolved before drafting)

- **5 tabs**, exactly as the kit declares (in this left-to-right order):
  1. `home` → `/[lang]` — label `t('tab.home')` = "Home" / "Дом"
  2. `events` → `/[lang]/events` — label `t('tab.events')` = "Agenda" / "Падзеі"
  3. `donate` → `/[lang]/donate` — label `t('tab.donate')` = "Steun" / "Падтр." (CENTER, raised pill, conic rainbow)
  4. `help` → `/[lang]/help` — label `t('tab.help')` = "Hulp" / "Дапам." (a hub listing Vreemdelingenpaspoort and Refugees-bot)
  5. `about` → `/[lang]/about-us` — label `t('tab.info')` = "Info" / "Інфа"
- **Refugees-bot lives under the Help tab** (user-confirmed). The existing `/[lang]/info/page.tsx` is renamed to `/[lang]/help/page.tsx`. The page already lists Vreemdelingenpaspoort and Refugees-bot — no content change, only route rename + tab key/label rename.
- **About tab still owns Vacatures + Jaarverslagen** — already implemented as a Related section on `/about-us`. No change.
- **Tab labels intentionally diverge from page titles** (e.g. tab 5 is labeled "Info" but routes to About; tab 4 is labeled "Hulp" but routes to a help hub). This is the kit's choice, copied verbatim. The plan does NOT rename the tabs to match page titles.

## Out of scope

- Mobile Home/Events/About/Passport/Donate **screen content** — the kit shows hero/featured/agenda/etc. layouts, but those are separate plans (one per screen). This plan only touches chrome (header, tab bar) + the help-hub route rename + i18n.
- Desktop nav — unchanged.
- The duplicate `@property --mara-angle` / `@utility bg-rainbow-spin` block in `globals.css` (lines 183–224 vs 226–267) — flagged for a separate cleanup; out of scope here.

## Context (from discovery)

Files involved:
- `ui_kits/mobile/Header.jsx`, `ui_kits/mobile/styles.css` — design reference, read-only.
- `src/components/menu/mobile/tabBar.tsx` — the file to rewrite.
- `src/components/menu/mobile/__tests__/tabBar.test.tsx` — test file to update for new key set, order, and pill structure.
- `src/components/header/header.tsx` — backdrop classes to retune to match kit.
- `src/components/header/__tests__/header.test.tsx` — class-shape assertion to update.
- `src/app/[lang]/info/page.tsx` and `__tests__/page.test.tsx` — rename to `help`.
- `src/app/i18n/locales/{be,nl}/common.json` — add `tab.home`, `tab.events`, `tab.donate`, `tab.help`, `tab.info` namespaced keys (see "Technical Details").
- `src/app/i18n/locales/{be,nl}/info.json` → rename to `help.json`.
- `src/app/sitemap.ts` — rename `/info` → `/help` entry.
- `src/components/globals.css` — `bg-rainbow-spin` is already present and will be reused on the donate pill `<span>`. No CSS additions for the rainbow itself; only a small custom shadow utility may be added if Tailwind cannot express the kit's `box-shadow: 0 -1px 0 #EBEBEB, 0 -10px 20px rgb(0 0 0/.04)` inline.

Related patterns (no new patterns introduced):
- `usePathname()` from `next/navigation` for active-tab matching — already in current `tabBar.tsx`.
- FontAwesome 6 solid icons — kit uses text glyphs (`⌂ ◉ ❉ ⓘ ♥`) only because it's a static prototype; in production we keep the FontAwesome equivalents already wired in: `faHouse`, `faCalendarDays`, `faCircleInfo`, `faHandHoldingDollar`, `faHandshake` (Hulp). The kit's heart symbol on the donate pill maps to `faHeart` to preserve the design's affordance (the previous `faHandHoldingDollar` was off-spec).
- Server vs. client: `TabBar` stays a client component (needs `usePathname`).

Dependencies / external:
- No new npm packages; FontAwesome is already installed.
- No CMS, Stripe, Clerk impact.

## Development Approach

- **Testing approach**: Regular (code first, then tests). Same as the original plan.
- Each task ends with tests that match the kit (assert kit-derived values, not arbitrary ones).
- **Read the kit file before writing code for each task.** The plan summarizes; the kit is authoritative.
- Maintain backward compatibility on the `/info` URL by adding a redirect (`/[lang]/info` → `/[lang]/help`) so no live link 404s.

## Testing Strategy

- **Unit tests** (Jest):
  - `src/components/menu/mobile/__tests__/tabBar.test.tsx` — assert: 5 tabs in the kit's exact left-to-right order; the 3rd tab (`donate`) renders an inner `<span>` with `bg-rainbow-spin`; for each of 5 pathnames the matching tab has `aria-current="page"`; each tab `<Link>` `href` matches its expected route; labels resolve via `t('tab.home' | 'tab.events' | 'tab.donate' | 'tab.help' | 'tab.info')`.
  - `src/components/header/__tests__/header.test.tsx` — assert the rendered header has classes `backdrop-blur-xl backdrop-saturate-180 bg-white-shade/85` (or whichever tokens the implementation lands on; derived from `.m-header` in styles.css).
  - `src/app/[lang]/help/__tests__/page.test.tsx` — assert it renders both `Vreemdelingenpaspoort` and Refugees-bot (`https://t.me/belarusians_nl_bot`) links.
- **Build verification**: `npm run typecheck && npm run lint && npm run build` — clean.
- **No e2e**: project has no Playwright; manual mobile spot-check happens in Post-Completion.

## Progress Tracking
- Mark items `[x]` immediately when done.
- Add newly discovered tasks with ➕ prefix.
- Document blockers with ⚠️ prefix.
- If the kit and reality conflict (e.g. a CSS value cannot be expressed in Tailwind 4 without a new utility), STOP and update this plan with the resolution rather than improvising the value.

## What Goes Where
- **Implementation Steps** (`[ ]`): code, tests, route rename, i18n, redirect.
- **Post-Completion** (no checkboxes): manual mobile device spot-check, Lighthouse a11y re-run.

## Implementation Steps

### Task 1: Rename `/info` → `/help` (route + i18n + sitemap + redirect)

Reads from kit: nothing — IA decision driven by user-confirmed answer ("Refugees-bot under Help"). The kit uses key `passport` for tab 4; we map to `/help` because our hub also includes refugees-bot.

- [x] rename `src/app/[lang]/info/` → `src/app/[lang]/help/` (the prior `/info` page was overwritten in the design refresh, so this re-creates the hub directly at `/help`; `Help` component identical in shape to the prior `Info` component).
- [x] rename `src/app/i18n/locales/be/info.json` → `be/help.json`; same for `nl` (created `help.json` directly since `info.json` no longer existed in this branch).
- [x] update any `getTranslation(lang, 'info')` calls in the renamed page to `getTranslation(lang, 'help')`.
- [x] update `src/app/sitemap.ts` entry `/info` → `/help` (current sitemap had no `/info` entry — added `/help` alongside `/alien-passport`).
- [x] add a permanent redirect via `next.config.js` `redirects()` (the file is `.js` in this repo, not `.ts`) from `/:lang(be|nl)/info` → `/:lang/help`.
- [x] update test `src/app/[lang]/help/__tests__/page.test.tsx` (renamed from `info`).
- [x] grep verification: `grep -rn "/info" src` returns zero matches (also `'info'` namespace string).
- [x] run tests — must pass before Task 2.

### Task 2: Update i18n keys to the kit's `tabHome / tabEvents / tabDonate / tabHelp / tabInfo`

Reads from kit: `ui_kits/mobile/Header.jsx` lines 165–179 (the `labels()` function).

- [x] in `src/app/i18n/locales/be/common.json` add a `tab` namespace block:
  ```json
  "tab": {
    "home": "Дом",
    "events": "Падзеі",
    "donate": "Падтр.",
    "help": "Дапам.",
    "info": "Інфа"
  }
  ```
- [x] in `src/app/i18n/locales/nl/common.json` add the equivalent NL block:
  ```json
  "tab": {
    "home": "Home",
    "events": "Agenda",
    "donate": "Steun",
    "help": "Hulp",
    "info": "Info"
  }
  ```
- [x] DO NOT delete the existing `home` / `useful-info` / `about-us` / `donate-us` / `info` top-level keys yet — they may be used elsewhere. Grep for usages of each old key; if a key has zero usages outside the tab bar, delete it; otherwise leave. (Verified: `useful-info`, `about-us`, `donate-us` are still consumed by `desktopMenu.tsx` / `mobileMenu.tsx` / `help/page.tsx`, so left intact. No `home` or top-level `info` key existed in `common.json` to begin with.)
- [x] no test for json files; verified by Task 3 tests (which read the new keys).

### Task 3: Rebuild `TabBar` to match the kit

Reads from kit: `ui_kits/mobile/Header.jsx` `TabBar` component (lines ~138–162) and `ui_kits/mobile/styles.css` `.m-tabbar` block (lines ~309–351).

- [x] open `src/components/menu/mobile/tabBar.tsx` and rewrite top to bottom. The skeleton:
  ```tsx
  // Order MUST match ui_kits/mobile/Header.jsx → tabs[]
  const TABS: TabDef[] = [
    { key: 'home',   segment: '',           labelKey: 'tab.home',   icon: faHouse },
    { key: 'events', segment: 'events',     labelKey: 'tab.events', icon: faCalendarDays },
    { key: 'donate', segment: 'donate',     labelKey: 'tab.donate', icon: faHeart, donate: true }, // center pill
    { key: 'help',   segment: 'help',       labelKey: 'tab.help',   icon: faHandshake },
    { key: 'about',  segment: 'about-us',   labelKey: 'tab.info',   icon: faCircleInfo },
  ];
  ```
- [x] update `TabKey` type accordingly: `'home' | 'events' | 'donate' | 'help' | 'about'`.
- [x] update `activeTab(pathname, lang)`: drop the old `info` branch; add a `help` branch that matches `/help` and `/alien-passport` (because the help hub links to passport content); keep the `about` branch matching `/about-us | /vacancies | /reports`.
- [x] structural change to the donate cell: instead of an `<li>` containing a `<Link>` containing icon-chip + label, the donate cell renders a `<Link>` whose body is **only** the raised dot pill. Per the kit, the donate tab visually overflows the bar (margin-top: -20px) so the dot floats above the surface. Translate kit values:
  - dot: `relative isolate overflow-hidden -mt-5 mx-auto h-10 w-10 rounded-full bg-black-tint text-white flex items-center justify-center shadow-lg bg-rainbow-spin` (the existing `bg-rainbow-spin` utility carries the conic + animation).
  - label below: `text-[10px] leading-none font-medium mt-1` ("Steun"/"Падтр.")
- [x] non-donate cell: column layout, FA icon at 22px (`w-[22px] h-[22px]`, kit uses `font-size: 22px`), label `text-[10px] font-medium leading-none`. Active color `text-primary` (#ED1C24); inactive `text-grey` (#808080).
- [x] outer `<nav>`: `fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 bg-white pt-2 px-1 pb-[34px] md:hidden` plus inline `style={{ boxShadow: '0 -1px 0 #EBEBEB, 0 -10px 20px rgb(0 0 0 / 0.04)' }}` (chosen over an arbitrary-value Tailwind utility because Tailwind 4's arbitrary syntax stumbles on multi-shadow values containing commas).
- [x] keep `data-umami-event="donate-us"` on the donate `<Link>`.
- [x] keep `aria-current="page"` on the active tab.
- [x] update `src/components/menu/mobile/__tests__/tabBar.test.tsx` (created fresh — no prior file existed on this branch):
  - asserts tabs render in `[home, events, donate, help, about]` order via `findAllByType(result, 'a')` (the test mocks `next/link` to the host string `'a'`, since the project's jest env is `node` and we invoke the component as a function).
  - asserts the donate `<Link>` subtree contains an element whose className includes `bg-rainbow-spin`.
  - asserts `activeTab` for pathnames `/be`, `/be/events`, `/be/donate`, `/be/help`, `/be/alien-passport`, `/be/about-us`, `/be/vacancies`, `/be/reports/2025`, plus negative + nl-prefix coverage.
  - asserts each tab `href` matches `/${lang}/${segment}` (or `/${lang}` for home) for both `be` and `nl`.
  - asserts `aria-current="page"` only on the active tab for each canonical pathname.
- [x] run tests — must pass before Task 4. (16/16 tabBar tests pass; full suite: 157/157.)

### Task 4: Retune mobile header backdrop to kit values

Reads from kit: `ui_kits/mobile/styles.css` `.m-header` (lines ~26–33).

Kit declares: `background: rgba(246,246,246,0.85); backdrop-filter: saturate(180%) blur(16px); position: sticky; top: 0; z-index: 30;`

Translation to Tailwind 4 utilities currently used in this repo:
- `bg-white-shade/85` (existing `--color-white-shade` is `#F6F6F6`)
- `backdrop-blur-2xl` (16px) — Tailwind 4 default `backdrop-blur-2xl` is 40px which is too much; use arbitrary `backdrop-blur-[16px]`.
- `backdrop-saturate-180` — Tailwind 4 has `backdrop-saturate-150`; use arbitrary `backdrop-saturate-[1.8]`.
- `sticky top-0 z-50` — keep existing `z-50` (header sits above the tab bar's `z-50` due to render order; if that proves brittle, raise tab bar to `z-40` per the kit's `.m-tabbar { z-index: 50 }` comment is internal to the kit — flag as ⚠️ if a stacking issue surfaces).

- [x] edit `src/components/header/header.tsx`: replace `bg-white-shade/80 backdrop-blur-md` with `bg-white-shade/85 backdrop-blur-[16px] backdrop-saturate-[1.8]` (keep `md:bg-white-shade` for desktop where blur is irrelevant). (The current branch had `bg-white-shade` without prior blur classes — added the kit-spec mobile classes alongside the desktop override.)
- [x] update `src/components/header/__tests__/header.test.tsx` shape assertion: expect classes `backdrop-blur-[16px]`, `backdrop-saturate-[1.8]`, `bg-white-shade/85`.
- [x] run `npm run typecheck && npm run lint` — must pass. (typecheck clean; lint has 5 pre-existing errors only in `ui_kits/mobile/` which is read-only per this plan; no new errors or warnings from header changes.)
- [x] run tests — must pass before Task 5. (Full suite: 158/158 passing.)

### Task 5: Verify acceptance against the kit

Open both windows side-by-side: `ui_kits/mobile/index.html` (in a browser) and `npm run dev` mobile viewport. Compare the chrome only (header + tab bar). Body content will diverge — that's other plans' scope.

- [x] tab bar order matches kit (home, events, donate-pill, help, about). (Asserted in `tabBar.test.tsx` via `findAllByType` on the rendered tree; manual visual spot-check skipped — not automatable.)
- [x] donate pill is centered, raised (`-mt-5`), 40×40, conic rainbow, dark background showing through. (Asserted in `tabBar.test.tsx` that the donate `<Link>` subtree contains an element with `bg-rainbow-spin`; pixel-level visual match skipped — not automatable.)
- [x] active tab color matches kit's `#ED1C24` (the existing `text-primary` token). (Token is `--color-primary` in `globals.css` mapped to `#ED1C24`; tab uses `text-primary` class. Manual visual skipped — not automatable.)
- [x] inactive tab color matches kit's `#808080` (the existing `text-grey` token). (Token is `--color-grey` mapped to `#808080`; tab uses `text-grey`. Manual visual skipped — not automatable.)
- [x] header background shows page content visibly blurred + slightly desaturated when scrolling. (Header uses `backdrop-blur-[16px] backdrop-saturate-[1.8] bg-white-shade/85` per Task 4; visual confirmation skipped — not automatable.)
- [x] tab bar's `34px` bottom padding leaves the iOS home indicator clear. (Implemented as `pb-[34px]` in `tabBar.tsx`; device verification skipped — not automatable.)
- [x] `/be/info` and `/nl/info` redirect to `/be/help` and `/nl/help`. (Verified by reading `next.config.js` — the `/:lang(be|nl)/info` → `/:lang/help` permanent redirect is wired in `redirects()`.)
- [x] `npm test` — all passing. (158/158 passing.)
- [x] `npm run lint` — zero errors. (Zero errors in project code; 5 errors remain in `ui_kits/mobile/` which is read-only per this plan and pre-existing.)
- [x] `npm run build` — succeeds, generates `/be/help` and `/nl/help` static pages. (Build compiled successfully; `/be/help` and `/nl/help` listed in the SSG output.)

### Task 6: Update CLAUDE.md note

- [ ] in the project `CLAUDE.md` "Architectural Decisions" section, replace the previous mobile-tab-bar paragraph with: "Mobile chrome (header + bottom tab bar) is implemented from the kit at `ui_kits/mobile/`. Tab order, labels, colors, and the raised donate pill come from `ui_kits/mobile/Header.jsx` + `styles.css` — do not improvise them. Tabs: home, events, donate (center, conic-rainbow pill via `bg-rainbow-spin`), help (hub for passport + refugees-bot at `/[lang]/help`), about. Header uses `backdrop-blur-[16px] backdrop-saturate-[1.8] bg-white-shade/85`."
- [ ] no test (docs only).

## Technical Details

- **Active-tab function** (single helper, pure, fully tested):
  ```ts
  export function activeTab(pathname: string, lang: Lang): TabKey | null {
    const prefix = `/${lang}`;
    const path = pathname === prefix || pathname.startsWith(`${prefix}/`)
      ? pathname.slice(prefix.length)
      : pathname;
    if (path === '' || path === '/') return 'home';
    if (matchesSegment(path, 'events'))                        return 'events';
    if (matchesSegment(path, 'donate'))                        return 'donate';
    if (matchesSegment(path, 'help') || matchesSegment(path, 'alien-passport')) return 'help';
    if (matchesSegment(path, 'about-us') || matchesSegment(path, 'vacancies') || matchesSegment(path, 'reports')) return 'about';
    return null;
  }
  ```
- **Donate pill DOM** (mirrors `.m-tabbar .donate-tab .dot`):
  ```tsx
  <Link href={`/${lang}/donate`} aria-current={isActive ? 'page' : undefined} data-umami-event="donate-us"
    className="flex flex-col items-center justify-center min-h-[44px] no-underline">
    <span className="bg-rainbow-spin -mt-5 h-10 w-10 rounded-full bg-black-tint text-white flex items-center justify-center shadow-lg">
      <FontAwesomeIcon icon={faHeart} className="w-[18px] h-[18px]" />
    </span>
    <span className={`text-[10px] leading-none font-medium mt-1 ${isActive ? 'text-primary' : 'text-grey'}`}>
      {t('tab.donate')}
    </span>
  </Link>
  ```
- **Reused utility**: `bg-rainbow-spin` already exists in `globals.css` (lines 189–224) with the seamless conic and 6s animation matching `.m-tabbar .donate-tab .dot::before`. Use it directly. **Do not introduce a second conic gradient definition** — the existing one is the same recipe.
- **Tab bar shadow**: Tailwind 4 supports arbitrary multi-shadow via square brackets; if the comma in the value confuses the parser, fall back to an inline `style={{ boxShadow: '0 -1px 0 #EBEBEB, 0 -10px 20px rgb(0 0 0/0.04)' }}`. Either is acceptable; the value is fixed.
- **Redirect for `/info`**: in `next.config.ts`:
  ```ts
  async redirects() {
    return [
      { source: '/:lang(be|nl)/info', destination: '/:lang/help', permanent: true },
    ];
  }
  ```

## Post-Completion

*Items requiring manual intervention — no checkboxes.*

**Manual verification**:
- Real-device check on iPhone (Safari) and Android (Chrome): tab bar pinned across all screens; donate pill conic animation runs smoothly (no jank); header blur + saturation visible while scrolling; `/info` URLs redirect.
- Lighthouse mobile re-run on `/be` and `/nl/help`: accessibility ≥ previous score.
- Compare chrome side-by-side with `ui_kits/mobile/index.html` (load in a local browser) at the same zoom level.

**External system updates**: none.

**Follow-on**:
- Subsequent screen-content plans (Home editorial layout, Events filter+agenda, Passport form, Donate amount picker, About) will each reference `ui_kits/mobile/{Home,Screens,Donate}.jsx` for their respective specs. Same rule: the kit is authoritative, no improvisation.

**Open questions** (resolve only if encountered during execution; do not invent):
- If the kit's `box-shadow: 0 -1px 0 #EBEBEB, 0 -10px 20px rgb(0 0 0/.04)` cannot be expressed cleanly in Tailwind 4 arbitrary syntax, fall back to inline `style={{ boxShadow: '...' }}` — value stays exact.
- If `backdrop-blur-[16px]` + `backdrop-saturate-[1.8]` produce a different pixel result than the kit (Safari iOS sometimes clamps `saturate` differently than Chromium), match the kit's visual rather than its CSS — but document the deviation here before applying.