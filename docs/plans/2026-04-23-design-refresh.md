# Chat-driven design refresh (Plan 3 of 3)

## Overview

The MARA design-system refresh (Claude Design handoff bundle, `mara-design-system/`) captures a series of decisions the user made while iterating in the design-tool chat. Those decisions are now canon. This plan ports every **chat-driven** decision into the website codebase — each item below corresponds to a specific turn the user iterated on in `mara-design-system/chats/chat1.md`.

Items covered (punch-list numbering):

1. **#1 Remove the wobble animation entirely.** User: *"Changing border radius is a joke I implemented long time ago. Let's remove it completely."*
2. **#2 Rewrite the Donate rainbow gradient.** User rejected the left-to-right linear slide ("gradient is jumping", "donate rainbow is still jumping, let's rewrite it completely") and settled on a seamless conic rotation driven by a registered `@property --angle`.
3. **#3 Remove dividers from nav and dropdown menus.** User: *"This line is probably too dark… let's remove dividers entirely. Hover background is the only affordance."*
4. **#4 Bump `--color-red-tint` to `#F36D72`.** User: *"I feel like tint is probably too close to primary."*
5. **#5 Stronger button hover/active states.** User: *"When I hover and click button I barely see difference."* Hover now lifts `translateY(-2px)` + shadow-2xl; active presses `translateY(1px)` + tight shadow.
6. **#8 Two logo variants: with and without the "Vereniging van Belarusen in Nederland" subtitle.** User: *"We have two kinds of logo: with text and without."*
7. **#10 Spinner — same color family, different opacities.** User: *"Now I see yellow circle? Why is it yellow?"* — direction comes from motion, color from surface, opacities differentiate rings.
8. **#12 Rewrite `--background-image-beautiful-button` value** (coupled with #2).

Problems solved: the site currently carries several visual elements the user has explicitly moved away from — the wobble, the sliding linear rainbow, the thick dropdown dividers, a near-duplicate `--color-red-tint`, and shadows-only button states that don't register a hover. The refresh makes the site feel decidedly more polished without rebuilding anything structural.

Out of scope (owned by other plans):
- Plan 1: token additions (NL flag tokens), hex → token migration in `src/app/layout.tsx`, creation of `src/theme/tokens.ts`.
- Plan 2: mobile hamburger → bottom tab bar, mobile header frosted-glass blur, info-hub page.
- No IA changes. No new pages. No copy changes.

Ordering rationale: Task 1 touches only tokens; Tasks 2–4 are the visible nav refresh (rainbow + wobble + dividers go together because they all live in `desktopMenu.tsx`); Tasks 5–7 are isolated component tweaks; Task 8 is the CSS cleanup that removes the now-dead wobble tokens and keyframes.

## Context (from discovery)

Files involved:

- `src/components/globals.css:7-216` — Tailwind 4 `@theme` block.
  - Line 9: `--color-red-tint: #ff1111;` — the value to bump.
  - Lines 71-80: `--background-image-beautiful-button: linear-gradient(60deg, #e1bc28, #21c241, #115eb7, #720cb6, #e1bc28, #21c241, #115eb7);` — the 4-color linear rainbow to replace.
  - Lines 92-98: `--animate-bg-rotation-slow`, `--animate-bg-rotation-slow-wobble-right`, `--animate-bg-rotation-slow-wobble`, `--animate-wobble-right` — all wobble animation tokens to remove.
  - Lines 163-208: `@keyframes wobble` and `@keyframes wobble-right` — keyframes to remove.
  - Lines 209-216: `@keyframes backgroundRotation` — used only by the old sliding rainbow; remove after rewrite.
- `src/components/menu/desktop/desktopMenu.tsx`:
  - Line 18: outer nav container has `divide-solid divide-light-grey divide-x animate-wobble-right` → strip both `divide-*` classes and `animate-wobble-right`.
  - Lines 20, 40, 75: dropdown menus have `divide-solid divide-light-grey divide-y` → strip.
  - Line 103: Donate link has `bg-[length:350%_100%] bg-beautiful-button ... rounded-r-md ... animate-bg-rotation-slow-wobble-right` → replace with new rainbow utility, drop wobble, change `rounded-r-md` → `rounded-md`.
- `src/components/menu/mobile/mobileMenu.tsx:24` (if Plan 2 hasn't landed yet): Join button has `bg-beautiful-button ... animate-bg-rotation-slow-wobble` → use same replacement strategy. Plan 2 retires the Join CTA entirely, so this line may not exist; Task 4 includes a guard to skip it if already removed.
- `src/components/button.tsx:38-48` — `Button` / `InnerButton`. Class list uses only `shadow-lg hover:shadow-xl active:shadow-2xl`. Add `translateY` transitions.
- `src/components/header/logo.tsx:7-71` — inline SVG, ~70 lines. The subtitle "Vereniging van Belarusen in Nederland" lives inside the same SVG in a separate `<g class="fill-black hidden md:block">` (line 37) — already responsively hidden on mobile. Adds a prop for explicit control.
- `src/components/spinner.tsx:3-15` — 3-ring spinner. Outer uses `border-l-primary`; middle and inner use `border-*-white`. Target: three opacities of `primary`.
- `src/components/dropdown.tsx` — check whether it carries its own `divide-*` classes in internal markup.

Design-system reference (source of truth for every visual decision):
- `mara-design-system/project/colors_and_type.css:13` — `--color-red-tint: #F36D72;`
- `mara-design-system/project/colors_and_type.css:131-133` — `--gradient-beautiful-button: conic-gradient(from 0deg, #ED1C24 0%, #F36D72 14%, #F59638 28%, #F5C84A 42%, #E8528C 60%, #8B2F8F 78%, #4B1D6B 88%, #AF0000 96%, #ED1C24 100%);`
- `mara-design-system/project/preview/gradients.html:7-59` — reference implementation of the seamless conic rotation using `@property --angle`, a `::before` pseudo-element at `width: 200%; aspect-ratio: 1; transform: translate(-50%, -50%)`, a 6-second linear `spin` keyframe, and an optional `::after` radial gloss. **Use this file as the reference when wiring the utility class.**
- `mara-design-system/project/preview/nav.html:28-53` — confirms the exact same rotation technique on the nav Donate pill: `--nav-angle` @property, `::before` at `width: 300%; aspect-ratio: 1;` (300% for narrower aspect ratios), same 6s linear loop. Keep `300%` for the narrow Donate pill.
- `mara-design-system/project/preview/buttons.html:8-26` — button state recipe: rest `shadow-lg + translateY(0)`; hover `shadow-2xl + translateY(-2px)`; active `box-shadow: 0 2px 4px rgb(0 0 0 / .18) + translateY(1px)`.
- `mara-design-system/project/preview/nav.html:12` confirms no dividers on the nav: *"no dividers — hover background is the affordance"*.
- Chat1 lines 330–359: `--color-red-tint` bump rationale; `#FF1111` was *"barely distinguishable from primary"*, `#F36D72` is *"a 15-20% lift… a distinct step off primary rather than a near-duplicate"*.
- Chat1 lines 538–664: full arc of the rainbow rewrite — *why* the linear gradient jumps, *why* changing animation-duration also jumps, and the `@property` + `from var(--angle)` solution.
- Chat1 lines 613–632: spinner color rule — "spinner rings share the accent color, varied by opacity". On white/ink surfaces → three opacities of primary red; on red surface → three opacities of white.

Related patterns:
- Tailwind 4 arbitrary values support `hover:-translate-y-0.5` (0.5 × 4px = 2px) and `active:translate-y-px`. Both compile to standard `translate3d` under the hood.
- Tailwind 4 custom utilities can be declared in `@layer utilities` inside `globals.css`. A `bg-rainbow-spin` utility is the right vehicle for the conic rotation (Tailwind can't express `::before` pseudo-element + `@property` in a single utility on its own, but a hand-written utility class within the Tailwind stylesheet is canonical).
- The project's `@property` support assumes modern browsers (Chrome 85+, Safari 16.4+, Firefox 128+). Verify `browserslist` in `package.json` — if it excludes Safari <16.4 the fallback is only the static gradient (acceptable; graceful).

Dependencies / external:
- No new npm packages.
- `npm run typecheck` / `npm run lint` / `npm run build` for verification.
- Jest for unit tests (`src/**/__tests__/*.test.tsx`).

## Development Approach

- **Testing approach**: Regular (code first, then targeted tests).
  - Pure CSS changes (Task 1, 2, 8) — no unit test applies. Verified by build + visual spot-check.
  - `Button` state change (Task 5) — assert the rendered className contains the new translate/shadow classes.
  - `Logo` prop refactor (Task 6) — component test checking that `showSubtitle={false}` drops the subtitle group.
  - `Spinner` color refactor (Task 7) — snapshot or className-contains assertion verifying opacity tokens applied.
- Complete each task fully before moving to the next.
- Maintain backward compatibility wherever possible. The rainbow utility class is new (old one still referenced until Task 2–4 complete); after Task 4 the old class/token is orphaned and Task 8 cleans it up.
- **CRITICAL: every task that changes behavior ships with tests in the same task.** Pure CSS tasks are explicitly noted as "build-verified only".
- Run `npm run typecheck && npm run lint` after every task.

## Testing Strategy

- **Unit tests** (per-task, required for behavioral changes):
  - `src/components/__tests__/button.test.tsx` — verify rest/hover/active class presence on the rendered button.
  - `src/components/header/__tests__/logo.test.tsx` — verify subtitle group rendered iff `showSubtitle` / default behavior matches.
  - `src/components/__tests__/spinner.test.tsx` — verify the three rings carry primary-color-with-opacity classes.
- **Build verification**: `npm run build` after Tasks 1, 2, 3, 4, 8 to confirm CSS compiles and nothing downstream breaks.
- **Visual spot-check** (Post-Completion):
  - Donate button in desktop nav: rainbow rotates seamlessly, no jump, no corner clipping, no hover speedup restart.
  - Dropdowns open and close with fade animation, no dividers between items.
  - Nav container is a flat rectangle with `rounded-md`, no wobbling radius.
  - Cards/buttons visibly lift on hover and press down on click.
  - Spinner shows three rings of decreasing red visibility on white surfaces.
- **E2E tests**: none — project has no Playwright/Cypress.

## Progress Tracking

- Mark completed items with `[x]` immediately when done.
- Add newly discovered tasks with ➕ prefix.
- Document issues/blockers with ⚠️ prefix.
- Update plan if implementation deviates from original scope.

## What Goes Where

- **Implementation Steps** (`[ ]` checkboxes): token edits, new CSS utility, component className swaps, Logo prop refactor, Spinner rewrite, dead-code cleanup, tests.
- **Post-Completion** (no checkboxes): visual spot-check across browsers, optional Lighthouse re-run, screenshot review with the user.

## Implementation Steps

### Task 1: Bump `--color-red-tint` in CSS + tokens.ts

- [x] in `src/components/globals.css:9`, change `--color-red-tint: #ff1111;` to `--color-red-tint: #f36d72;`.
- [x] if `src/theme/tokens.ts` exists (created by Plan 1), update the `redTint` value from `'#ff1111'` to `'#f36d72'` in lockstep. If Plan 1 has not shipped, note this as a follow-up cross-reference when Plan 1 lands — do not create `tokens.ts` in this plan.
- [x] grep `src` for any remaining `#ff1111` literals — expect zero.
- [x] run `npm run typecheck && npm run lint && npm run build`.
- [x] no unit test — pure value change. Verified by build + visual: places that use `bg-primary-tint` / `text-primary-tint` shift to the new softer coral.
- [x] must pass before Task 2.

### Task 2: Introduce `bg-rainbow-spin` utility class (seamless conic rotation)

- [x] in `src/components/globals.css`, **after** the `@theme` block, add a new `@layer utilities` block (or append to the existing base layer) containing:
  ```css
  @property --mara-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  @utility bg-rainbow-spin {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background-color: #231f20;           /* fallback core */
  }
  @utility bg-rainbow-spin {
    /* pseudo-element + keyframes */
  }

  .bg-rainbow-spin::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 300%; aspect-ratio: 1;
    transform: translate(-50%, -50%);
    background: conic-gradient(from var(--mara-angle),
      #ed1c24 0%, #f36d72 14%, #f59638 28%, #f5c84a 42%,
      #e8528c 60%, #8b2f8f 78%, #4b1d6b 88%, #af0000 96%, #ed1c24 100%);
    animation: mara-rainbow-spin 6s linear infinite;
    z-index: -1;
  }
  @keyframes mara-rainbow-spin { to { --mara-angle: 360deg; } }
  ```
  (Use Tailwind 4's `@utility` directive for the base class; keep the `::before` / `@keyframes` / `@property` declarations at file scope since those directives can't live inside `@utility`.)
- [x] also rewrite the `--background-image-beautiful-button` token value in `globals.css:71-80` to the new conic definition so any remaining Tailwind `bg-beautiful-button` consumers inherit the fix:
  ```css
  --background-image-beautiful-button: conic-gradient(from 0deg,
    #ed1c24 0%, #f36d72 14%, #f59638 28%, #f5c84a 42%,
    #e8528c 60%, #8b2f8f 78%, #4b1d6b 88%, #af0000 96%, #ed1c24 100%);
  ```
  Note: as a Tailwind *background-image token*, it doesn't animate on its own — it just upgrades the static gradient. Task 3 swaps active consumers to `bg-rainbow-spin` where rotation is wanted (the Donate nav pill). The static `bg-beautiful-button` class stays as a reasonable no-animation fallback if any other consumer shows up later.
- [x] run `npm run build` — must succeed; Tailwind 4 must accept the `@utility` directive + pseudo-element addendum.
- [x] no unit test — CSS-only. Verified by build and by Task 3 smoke-test.
- [x] must pass before Task 3.

### Task 3: Strip wobble + dividers + rewrite Donate pill in `desktopMenu.tsx`

- [x] open `src/components/menu/desktop/desktopMenu.tsx`.
- [x] line 18 — change `className="text-lg flex rounded-md bg-white cursor-pointer shadow-lg divide-solid divide-light-grey divide-x animate-wobble-right mr-auto"` to `className="text-lg flex rounded-md bg-white cursor-pointer shadow-lg mr-auto"`. Remove: `divide-solid divide-light-grey divide-x animate-wobble-right`.
- [x] lines 20, 40, 75 — remove `divide-solid divide-light-grey divide-y` from each dropdown menu container. Keep `animate-t-fade-in absolute mt-2 z-10 flex flex-col bg-white shadow-lg rounded-md`.
- [x] line 103 — change Donate `<Link>` className from `"p-1 md:p-2 lg:p-3 bg-[length:350%_100%] bg-beautiful-button font-normal rounded-r-md text-white transition-shadow no-underline hover:shadow-tbr-xl animate-bg-rotation-slow-wobble-right"` to `"p-1 md:p-2 lg:p-3 bg-rainbow-spin font-normal rounded-md text-white transition-shadow no-underline hover:shadow-tbr-xl"`. Changes: remove `bg-[length:350%_100%] bg-beautiful-button animate-bg-rotation-slow-wobble-right`, change `rounded-r-md` → `rounded-md`, add `bg-rainbow-spin`.
- [x] verify the nav visually: Donate pill rotates seamlessly, no wobble, no divider between items, plain `rounded-md` on all four corners. [manual visual check skipped - not automatable]
- [x] no new unit test — the classes are cosmetic. Existing desktop-menu tests (if any) should be updated to match the new class list; run `npx jest desktopMenu` — if no tests exist, skip.
- [x] run `npm run typecheck && npm run lint && npm run build`.
- [x] must pass before Task 4.

### Task 4: Mobile legacy wobble cleanup (coordinate with Plan 2)

- [x] check whether `src/components/menu/mobile/mobileMenu.tsx` still exists. If Plan 2 has shipped and the file is gone, **skip this task entirely**.
- [x] if it exists, open it and line 24 — on the Join `<Button>`, remove `bg-[length:350%_100%] bg-beautiful-button ... animate-bg-rotation-slow-wobble` and either (a) swap to `bg-rainbow-spin` if you want the Join button to remain a rainbow CTA in the interim, or (b) swap to the plain `bg-primary text-white` per the chat's final decision that Join is not a rainbow surface. Pick (a) — minimal behavioral change; Plan 2 will retire the button outright.
- [x] swap any other wobble references in the mobile menu file (same pattern) to the non-wobble equivalents.
- [x] run `npm run typecheck && npm run lint && npm run build`.
- [x] no unit test — cosmetic.
- [x] must pass before Task 5.

### Task 5: Stronger button hover/active states

- [ ] open `src/components/button.tsx:38-48`. Extend the `InnerButton` className so disabled buttons get no state change, non-disabled get the full translate + shadow recipe:
  ```tsx
  className={`transition-all duration-150 ${
    props.size === 'large' ? 'p-2 md:p-3 lg:p-4 text-lg' : 'p-1 md:p-2 lg:p-3'
  } rounded-md shadow-lg ${
    props.disabled
      ? ''
      : 'hover:shadow-2xl hover:-translate-y-0.5 active:shadow-md active:translate-y-px'
  } ${props.className ?? ''}`}
  ```
  Changes vs current: `hover:shadow-xl active:shadow-2xl` → `hover:shadow-2xl active:shadow-md`; add `hover:-translate-y-0.5 active:translate-y-px`; change `transition-all` to `transition-all duration-150` for a snappier feel (chat preview used `.18s` ease for shadow, `.12s` ease for transform — 150ms is the middle ground at Tailwind's coarsest granularity).
- [ ] add a unit test `src/components/__tests__/button.test.tsx` (or extend if present):
  - renders a non-disabled button, asserts className contains `hover:shadow-2xl`, `hover:-translate-y-0.5`, `active:translate-y-px`.
  - renders a disabled button, asserts className does **not** contain any of those hover/active tokens.
- [ ] run `npx jest button.test` — must pass.
- [ ] run `npm run typecheck && npm run lint && npm run build`.
- [ ] must pass before Task 6.

### Task 6: Logo variants (with / without subtitle)

- [ ] open `src/components/header/logo.tsx`. Change the props type:
  ```tsx
  interface Props {
    className?: string;
    showSubtitle?: boolean;
  }
  ```
  Default `showSubtitle` behaves like today (subtitle group rendered, with its existing `hidden md:block` responsive hide). When `showSubtitle={false}`, omit the subtitle `<g>` entirely (line 37).
- [ ] in the SVG, wrap the subtitle `<g class="fill-black hidden md:block">` with `{props.showSubtitle !== false && ( ... )}` so callers can opt-out.
- [ ] keep existing header caller in `src/components/header/header.tsx:16` unchanged (default behavior = subtitle visible ≥ md). If the mobile refresh (Plan 2) wants a subtitle-less logo on the new mobile header, the caller can pass `showSubtitle={false}` explicitly.
- [ ] verify logo fill color: the inline SVG already uses `fill-primary` classes (correct red). Nothing to do — the chat's concern about a black-rendered logo applied to the separate `public/logo/*.svg` assets, not this inline component.
- [ ] add a unit test `src/components/header/__tests__/logo.test.tsx`:
  - renders `<Logo />` — SVG present, subtitle group present.
  - renders `<Logo showSubtitle={false} />` — SVG present, subtitle group absent (query for the `<g class="fill-black ...">` element and assert null).
- [ ] run `npx jest logo.test` — must pass.
- [ ] run `npm run typecheck && npm run lint && npm run build`.
- [ ] must pass before Task 7.

### Task 7: Spinner — same color family, different opacities

- [ ] open `src/components/spinner.tsx`. Replace the three current ring definitions to use three opacities of `primary` instead of mixed primary/white:
  - outer (`before:`): `before:border-l-[color:rgb(237_28_36_/_0.35)]` (35% red)
  - middle (main span): `border-t-[color:rgb(237_28_36_/_0.65)] border-r-[color:rgb(237_28_36_/_0.65)]` (65% red)
  - inner (`after:`): `after:border-b-primary after:border-l-primary` (100% red)
- [ ] keep all three animation classes (`animate-rotate-back-fast`, `animate-rotate-slow`, `animate-rotate-back`) and the three sizes (80% / 100% / 60%) as-is. The differentiator is now opacity, not hue.
- [ ] add a unit test `src/components/__tests__/spinner.test.tsx`:
  - renders Spinner, asserts the rendered markup contains `border-l-[color:rgb(237_28_36_/_0.35)]` (or similar signature strings).
  - asserts only `primary`-family colors appear, no `border-*-white`.
- [ ] note: design-system README calls out two spinner surfaces (on red → use white opacities, on white → use red opacities). For now, only the white-surface variant is wired since the app shows Spinner on light backgrounds. A `variant="on-red"` prop can be added later if a red-surface consumer appears; do NOT build it speculatively in this task.
- [ ] run `npx jest spinner.test` — must pass.
- [ ] run `npm run typecheck && npm run lint && npm run build`.
- [ ] must pass before Task 8.

### Task 8: Remove dead wobble tokens and keyframes from `globals.css`

- [ ] open `src/components/globals.css`. Remove:
  - lines ~92-98: the wobble-related `--animate-*` tokens (`--animate-bg-rotation-slow-wobble-right`, `--animate-bg-rotation-slow-wobble`, `--animate-wobble-right`). Keep `--animate-bg-rotation-slow` for now only if any consumer still references the old `backgroundRotation` keyframe — if not, remove it as well.
  - `@keyframes wobble` (lines ~163-182) — remove.
  - `@keyframes wobble-right` (lines ~183-208) — remove.
  - `@keyframes backgroundRotation` (lines ~209-216) — remove iff no consumers remain.
- [ ] grep for any remaining usage: `grep -rn "wobble\|animate-bg-rotation-slow\|backgroundRotation" src` — expect zero hits outside `globals.css` (and after the delete, zero everywhere).
- [ ] run `npm run typecheck && npm run lint && npm run build` — must succeed.
- [ ] no unit test — pure CSS cleanup. The build is the guardrail; if any consumer references a removed class, Tailwind will emit a warning or the class will just be unresolved.
- [ ] must pass before Task 9.

### Task 9: Verify acceptance criteria and full scope

- [ ] verify all eight items from the Overview are implemented (red-tint bumped, rainbow rewritten, nav wobble/dividers gone, Donate pill has `rounded-md` + `bg-rainbow-spin`, buttons translate on hover/active, Logo has `showSubtitle` prop, Spinner uses red opacities, beautiful-button token upgraded, dead keyframes removed).
- [ ] `grep -rn "animate-wobble\|animate-bg-rotation-slow-wobble" src` — must return zero matches.
- [ ] `grep -rn "rounded-r-md" src/components/menu` — zero matches (Donate pill now has `rounded-md`).
- [ ] `grep -rn "#ff1111" src` — zero matches.
- [ ] run full test suite: `npm test`.
- [ ] run linter: `npm run lint` — no errors.
- [ ] run `npm run build` — must succeed.

### Task 10: Update CLAUDE.md with the new patterns

- [ ] in `CLAUDE.md`, add a short subsection "Visual foundations (refreshed)" under "Architectural Decisions" or near "Code Style", capturing three one-liners:
  - "Buttons translate on hover/active (`hover:-translate-y-0.5`, `active:translate-y-px`) alongside shadow escalation. Defined in `src/components/button.tsx`."
  - "The rainbow gradient is a seamless conic rotation driven by `@property --mara-angle` via the `bg-rainbow-spin` utility in `globals.css`. Do not reintroduce `animation-duration` hover changes — they cause a visible jump."
  - "Logo has a `showSubtitle` prop for the two approved variants (`src/components/header/logo.tsx`); callers default to the subtitle-visible variant."
- [ ] no test needed (documentation only).

## Technical Details

- **Why `@property --mara-angle`**: animating `transform: rotate(…)` causes hover-state resets (changing `animation-duration` restarts the animation, which snaps the angle to 0). Registering `--mara-angle` as an `<angle>` custom property makes it interpolatable, so rotation is continuous and hover-duration changes are safe. This is exactly the bug the user hit and the exact fix the design-system chat landed on.
- **Why `width: 300%; aspect-ratio: 1;` + `transform: translate(-50%, -50%)`**: a `conic-gradient` fills its element's rectangle. Rotating inside a rectangle exposes empty corners. A square pseudo-element sized to 300% of the parent's larger dimension, centered, guarantees the inscribed circle covers the parent's diagonal regardless of rotation — no black corners.
- **Why `hover:-translate-y-0.5` (2px)**: the design-system preview uses `translateY(-2px)` exactly; `-0.5` maps to `-0.125rem = -2px` at Tailwind's default 16px base, matching pixel-for-pixel.
- **Why `active:shadow-md` (not `active:shadow-sm`)**: the chat's reference value is `box-shadow: 0 2px 4px rgb(0 0 0 / .18)`, which is Tailwind's `shadow-md` at baseline. Close enough; if the press feels too soft, dial to `shadow-sm` in a follow-up.
- **Spinner opacity format**: using `[color:rgb(237_28_36_/_0.35)]` instead of a semantic `bg-primary/35` because Tailwind 4's percentage-opacity shorthand doesn't work on all border utilities uniformly — the arbitrary-value form is unambiguous.
- **`@utility` vs `@layer utilities`**: Tailwind 4 prefers `@utility` for new utility classes. The pseudo-element and `@keyframes` must live at file scope because they can't be nested inside `@utility`. This is documented behavior, not a workaround.

## Post-Completion

*Items requiring manual verification — no checkboxes.*

**Manual verification**:
- Open the site locally (`npm run dev`), navigate through home / events / donate / about on desktop:
  - Donate pill: rainbow rotates, seamless, no corner gaps, no hover-reset.
  - Dropdown menus: open with a fade, no dividers between items, hover on each item shows `bg-white-shade`.
  - Nav container: no wobbling radius, flat `rounded-md` always.
  - Any button: hover lifts visibly (shadow grows, content nudges up ~2px); click presses down.
- Check the spinner on a form submission (e.g. donate form) — three visibly different red-opacity rings, counter-rotating.
- Check the Logo on desktop (subtitle visible) and mobile (subtitle hidden), then drop a call site with `showSubtitle={false}` on desktop to sanity-check that path too.
- Capture before/after screenshots of the header and a button to attach to the PR.

**External system updates**: none. No analytics events, no CMS schema changes, no env vars.

**Cross-plan dependency**:
- If Plan 1 has not shipped when this plan starts, Task 1's tokens.ts edit is a no-op — fine.
- If Plan 2 has not shipped, Task 4 runs and cleans the mobile Join button. If Plan 2 ships first and `mobileMenu.tsx` is already deleted, Task 4 is a no-op — the guard at the top of the task handles this.
