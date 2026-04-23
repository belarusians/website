# Tokens + cleanup — align website with MARA design-system refresh (Plan 1 of 3)

## Overview

The MARA design system refresh (Claude Design handoff bundle, `mara-design-system/`) adds missing color tokens and expects all application code to reference tokens instead of hardcoded hex literals. This plan is the smallest, lowest-risk slice — it only adds/renames tokens and migrates existing hex usage. No visual changes are intended; if anything shifts visually, the token mapping is wrong.

Specifically this plan covers items **#11** and **#13** from the refresh punch list:
- Add the missing NL flag tokens (`--color-nl-red`, `--color-nl-blue`) and use them in the NL gradient.
- Migrate the three hardcoded hex literals in `src/app/layout.tsx` metadata to a shared JS token module, and standardize the `msapplication-TileColor` onto the brand red so it matches the rest of the palette.
- Leave SVG asset hex alone (out of scope per user decision).
- Leave `--color-red-tint` value and `--background-image-beautiful-button` alone — those belong in Plan 3 (chat-driven refresh) because they are coupled with the donate-rainbow rewrite.

Problems solved:
- NL gradient defines flag hex inline instead of referencing tokens, making the token inventory incomplete.
- `layout.tsx` has `#ed1c24`, `#f6f6f6`, `#b91d47` as string literals — untokenized, un-searchable, and the last one (`#b91d47`) is off-palette (legacy Windows-tile red, not brand red).

Out of scope (deferred to other plans):
- Plan 2: mobile hamburger → bottom tab bar, mobile header frosted-glass blur.
- Plan 3: remove wobble animations, donate rainbow rewrite, dropdown dividers, `--color-red-tint` bump, stronger button states, logo variants, spinner opacity palette, beautiful-button token value.
- Any hex inside `public/**/*.svg`.

## Context (from discovery)

Files involved:

- `src/components/globals.css:7-80` — Tailwind 4 `@theme` block. Colors defined lines 7-25. Flag gradient `--background-image-nl` at lines 46-54 uses inline hex `#ae1c28` and `#21468b` instead of tokens. `--background-image-be` at lines 55-63 uses inline `#fff`.
- `src/app/layout.tsx:44` — `<link rel="mask-icon" … color="#ed1c24" />` (safari pinned-tab).
- `src/app/layout.tsx:114` — `export const viewport: Viewport = { themeColor: '#f6f6f6' }`.
- `src/app/layout.tsx:147` — `'msapplication-TileColor': '#b91d47'` (inside `generateMetadata().other`).
- `src/lib/` — existing utility modules (`s3.ts`, `email.ts`, etc.); there is no `src/theme/` or token module yet.
- `tsconfig.json` path alias: `@/*` → `./src/*`.

Design-system reference:
- `mara-design-system/project/colors_and_type.css:26-31` — adds `--color-nl-red: #AE1C28` and `--color-nl-blue: #21468B` as first-class tokens, used by `--gradient-nl` at lines 118-121.

Patterns:
- Next.js metadata API accepts plain strings only; CSS `var(--color-primary)` does not work inside `themeColor` / `msapplication-TileColor`. Either hardcode or import from a JS module — we pick the latter.
- Jest tests live under `__tests__/` directories with `.test.ts[x]` extension; there is no existing test for `layout.tsx`. A minimal shape test for the new `tokens.ts` is cheap; asserting metadata values from the layout adds little since TypeScript already enforces the Viewport/Metadata types.
- Path alias `@/theme/tokens` will resolve cleanly once the file is created under `src/theme/`.

Dependencies / external:
- None. No npm install needed.
- Lint: project uses ESLint (`npm run lint` / `lint:fix`).
- Type-check: `npm run typecheck`.
- Build verification: `npm run build` exercises Tailwind 4 theme compilation and Next.js metadata generation.

## Development Approach

- **Testing approach**: Regular (code first, minimal targeted tests).
  - For `tokens.ts` the TypeScript compiler is the primary guardrail; a small shape test guards against accidental key removal during future refactors.
  - For `globals.css` gradient changes there is no unit-testable surface. Verification = build + local visual check of `bg-nl` / `bg-be` utilities (used by the language selector and flag decorative elements).
  - For `layout.tsx` metadata migration there is no useful unit test — the values round-trip through Next.js's string-typed metadata API. Verification = `npm run build` plus a grep asserting no hardcoded hex remains in `src/app/layout.tsx`.
- Complete each task fully before moving to the next.
- No behavioral / visual changes are intended. If a token refactor changes a pixel, the mapping is wrong.
- **CRITICAL: every task MUST include new/updated tests where a test adds value.** For this plan that means:
  - Task 2 ships with a `tokens.test.ts` shape test (required — see Testing Strategy).
  - Task 1 and Task 3 are verified via `npm run typecheck && npm run lint && npm run build`; no unit test applies, which is noted per-task.
- Run tests after each change.
- Maintain backward compatibility — `bg-nl`, `bg-be`, `bg-beautiful-gradient` Tailwind utilities must continue to produce pixel-identical output.

## Testing Strategy

- **Unit tests**: `src/theme/__tests__/tokens.test.ts` asserts the token module exposes the expected keys and that each value is a valid hex string. This guards the shape, not the visual values.
- **Build verification**: `npm run typecheck && npm run lint && npm run build` must succeed after every task. The build surfaces Tailwind 4 theme errors and Next.js metadata type errors that no unit test would catch.
- **Visual spot-check** (Post-Completion): manually view the site to confirm the NL flag gradient and theme-color / safari-pinned-tab color are unchanged.
- **E2E tests**: the project has no Playwright/Cypress setup. Skip.

## Progress Tracking

- Mark completed items with `[x]` immediately when done.
- Add newly discovered tasks with ➕ prefix.
- Document issues/blockers with ⚠️ prefix.
- Update plan if implementation deviates from original scope.

## What Goes Where

- **Implementation Steps** (`[ ]` checkboxes): token file creation, edits to `globals.css` and `layout.tsx`, unit test, local verification commands.
- **Post-Completion** (no checkboxes): visual spot-check in a browser, Safari pinned-tab re-verify (requires installing the site as a Safari favorite), Windows tile re-verify (not practical without a Windows host).

## Implementation Steps

### Task 1: Add NL flag tokens and normalize flag gradients to use tokens

- [ ] in `src/components/globals.css` `@theme` block, add two new tokens below `--color-yellow-ukraine` (around line 22), following existing casing (lowercase hex):
  - `--color-nl-red: #ae1c28;`
  - `--color-nl-blue: #21468b;`
- [ ] rewrite `--background-image-nl` (lines 46-54) to reference the new tokens and `--color-white`:
  ```
  --background-image-nl: linear-gradient(
    180deg,
    var(--color-nl-red) 0,
    var(--color-nl-red) 33%,
    var(--color-white) 33%,
    var(--color-white) 67%,
    var(--color-nl-blue) 67%,
    var(--color-nl-blue) 100%
  );
  ```
- [ ] rewrite `--background-image-be` (lines 55-63) so every `#fff` stop reads `var(--color-white)` (keep `var(--color-primary)` as-is).
- [ ] do NOT touch `--background-image-beautiful-gradient` or `--background-image-beautiful-button` — deferred to Plan 3.
- [ ] do NOT touch `--color-red-tint` value — deferred to Plan 3.
- [ ] verify no unintended reflow: `npm run typecheck && npm run lint && npm run build`. No unit test applies (pure CSS variable change).
- [ ] confirm `bg-nl` and `bg-be` Tailwind utilities still compile by grepping the build output (or `grep -r 'bg-nl\|bg-be' src`) for consumers and confirming the site builds — must pass before Task 2.

### Task 2: Create shared theme tokens module for TSX consumers

- [ ] create `src/theme/tokens.ts` exporting a typed `COLORS` object mirroring the CSS custom properties. Keys match the `--color-*` variables (camelCase transform):
  - `red: '#ed1c24'`
  - `redShade: '#af0000'`
  - `redTint: '#ff1111'` — keep the current value for now; Plan 3 will flip this to `#f36d72` in lockstep across CSS and TS.
  - `white: '#ffffff'`
  - `whiteShade: '#f6f6f6'`
  - `black: '#231f20'`
  - `blackTint: '#333333'`
  - `grey: 'rgb(128, 128, 128)'`
  - `lightGrey: 'rgb(235, 235, 235)'`
  - `blueUkraine: '#0056b9'`
  - `yellowUkraine: '#ffd800'`
  - `kingOrange: '#F64D04'`
  - `kingOrangeShade: '#BF3903FF'`
  - `kingOrangeTint: '#f36227'`
  - `nlRed: '#ae1c28'`
  - `nlBlue: '#21468b'`
- [ ] export as `export const COLORS = { … } as const;` so TypeScript narrows the values to string literals.
- [ ] also export a `PRIMARY` alias (`PRIMARY = COLORS.red`) to match the `--color-primary` CSS alias.
- [ ] add one-line header comment `// Keep in sync with @theme block in src/components/globals.css` — this is the narrow exception to the "no comments" rule because the invariant is enforced only by humans.
- [ ] create `src/theme/__tests__/tokens.test.ts` with:
  - test that `COLORS` exposes every expected key (import the constant, assert `Object.keys(COLORS).sort()` deep-equals the expected list).
  - test that every value matches `^#[0-9a-fA-F]{6,8}$|^rgb\(` (shape validation).
  - test that `PRIMARY === COLORS.red`.
- [ ] run `npx jest tokens.test` — must pass before Task 3.

### Task 3: Migrate src/app/layout.tsx metadata hex to tokens

- [ ] in `src/app/layout.tsx`, add `import { COLORS } from '@/theme/tokens';` near the other imports.
- [ ] replace line 44 `color="#ed1c24"` with `color={COLORS.red}`.
- [ ] replace line 114 `themeColor: '#f6f6f6'` with `themeColor: COLORS.whiteShade`.
- [ ] replace line 147 `'msapplication-TileColor': '#b91d47'` with `'msapplication-TileColor': COLORS.red`. This intentionally standardizes the Windows tile color onto brand red (`#ed1c24`). The old `#b91d47` is a legacy off-palette value; the design system normalizes on brand red for chrome surfaces. Note this in the commit message.
- [ ] run `grep -niE '#[0-9a-f]{3,8}\b' src/app/layout.tsx` — must return zero hex literals (confirms migration is complete).
- [ ] run `npm run typecheck && npm run lint` — must pass.
- [ ] no unit test — Next.js metadata is string-typed and round-trips without transformation; the grep + build suffice.

### Task 4: Verify acceptance criteria and full scope

- [ ] verify all three items from the Overview are implemented (NL tokens added, flag gradients reference tokens, layout.tsx hex migrated).
- [ ] run `grep -rniE '#[0-9a-f]{3,8}\b' src --include='*.tsx' --include='*.ts'` — the only hits should be inside `src/theme/tokens.ts` (where hex is definitionally the source of truth).
- [ ] run `grep -niE '#[0-9a-f]{3,8}\b' src/components/globals.css` — every hit should be inside a `--color-*: #…;` variable definition line (no hex stops in `--background-image-*` except inside `--background-image-beautiful-button`, which is deferred to Plan 3).
- [ ] run full test suite: `npm test`.
- [ ] run linter: `npm run lint` — no errors.
- [ ] run `npm run build` — must succeed; confirms Tailwind 4 theme compiles and no metadata type errors.

### Task 5: Update project CLAUDE.md with tokens convention

- [ ] in `CLAUDE.md`, add a short "Theme tokens" subsection under "Code Style" explaining that hex values in TSX/TS should import from `@/theme/tokens` and that `globals.css` `@theme` block is the source of truth for CSS variables. Keep it to 3-4 lines — no code examples, reference the files.
- [ ] no test needed (documentation only).

## Technical Details

- Tailwind 4 `@theme` block auto-generates utility classes from the variable names. Adding `--color-nl-red` and `--color-nl-blue` also generates `bg-nl-red`, `text-nl-red`, etc. — these utilities are free of charge; use them if any future consumer wants direct access.
- `var(--color-white)` resolves to `#ffffff` regardless of consumer, so `#fff` → `var(--color-white)` is a byte-identical substitution. Same for `var(--color-nl-red)` → `#ae1c28`.
- `src/theme/tokens.ts` values are plain string literals. Do not attempt to read from CSS at runtime (no `getComputedStyle` gymnastics); the JS module is the source of truth for JS consumers, the CSS variables are the source of truth for CSS consumers, and the one-line comment at the top of `tokens.ts` enforces parity by convention.
- `COLORS.kingOrangeShade` keeps the `FF` alpha byte (`#BF3903FF`) exactly as written in `globals.css` to avoid any bit-level change during this token-only plan. Plan 3 may normalize it.

## Post-Completion

*Items requiring manual verification or external systems — no checkboxes, informational only.*

**Manual verification**:
- Load the site locally (`npm run dev`) and confirm:
  - The language selector still shows the NL flag gradient behind the `NL` toggle (if the `bg-nl` class is still attached; otherwise the site never rendered it — in which case nothing to compare).
  - Browser tab color (iOS Safari theme-color) unchanged — still `#f6f6f6`.
  - Safari pinned-tab mask icon still renders red.
- Windows tile color (`msapplication-TileColor`) changes from `#b91d47` → `#ed1c24`. No practical way to verify without a Windows host; it is OK to accept this on faith since the value is correct by definition (brand red).

**External system updates**: none. No deployment configs, no third-party integrations, no consuming packages.

**Follow-on plans**:
- Plan 2: `docs/plans/YYYY-MM-DD-mobile-tab-bar.md` — mobile hamburger → bottom tab bar, mobile header frosted-glass blur. Needs IA decisions on tab labels and fate of Vacatures / Jaarverslagen.
- Plan 3: `docs/plans/YYYY-MM-DD-design-refresh.md` — the eight chat-driven items (wobble removal, donate rainbow rewrite, dropdown dividers, red-tint bump, button states, logos, spinner, beautiful-button gradient value).
