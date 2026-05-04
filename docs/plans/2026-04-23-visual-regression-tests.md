# Visual regression tests for PRs

## Overview

Add a CI check on every PR that takes screenshots of the home page on both the PR branch and `main`, compares them pixel-by-pixel, and fails (blocking merge) when they differ beyond a small tolerance. First version covers the home page in both locales (`/be`, `/nl`) on mobile and desktop viewports.

**Problem.** Regressions in layout, spacing, color, typography, or component rendering slip through because CI only runs ESLint + Jest today. No automated visual check.

**Design choices (decided during planning):**
- **Self-contained CI** — both sides are built inside the same GitHub Actions runner. No staging branch, no Vercel API, no workflow with `contents: write` or any other write-scoped token. Fully reproducible on a developer's laptop. This was chosen over an auto-fast-forwarded `staging` branch to eliminate the CI-side attack surface.
- **Masking over thresholds** for the gradient — the sole `bg-beautiful-gradient` element at `src/app/[lang]/page.tsx:67` is masked during screenshotting. Pixel tolerance elsewhere is near-zero (0.1 %).
- **Live-to-live comparison** — screenshots produced in-run; no PNG baselines committed to the repo, so no baseline-update churn.

## Context (from discovery)

- Legacy `origin/screenshot-comparison` branch is from 2023-03-29 (last commit `5c4817f`). Predates the Sanity/Clerk stack, App Router, Tailwind 4. Too stale to rebase. Start fresh.
- Current CI: `.github/workflows/ci.yml` runs `lint` + `test` (Jest). No Playwright, no preview wiring. 20 lines total.
- Gradient location: `src/app/[lang]/page.tsx:67`, one `<Section className="bg-beautiful-gradient ...">` consuming `--background-image-beautiful-gradient` from `src/components/globals.css:66`. Single surface to mask on the home page.
- Home page is `src/app/[lang]/page.tsx` with ISR (`export const revalidate = N`). Middleware (`src/middleware.ts`) redirects `/` → default locale.
- No Playwright dependency in `package.json`.
- Deployed on Vercel, but this plan does not interact with Vercel — everything runs inside the runner.

## Development Approach

- **Testing approach**: N/A for conventional unit tests — the deliverable *is* the test. No unit tests will be added for the Playwright spec or the compare script. Each task ends with a manual verification step.
- Complete each task fully before moving on.
- The new CI job must run independently of `lint`/`test` (parallel) so developers aren't waiting longer end-to-end.
- No new secrets, no new tokens, no mutating scopes anywhere in the workflow. `permissions:` block is declared explicitly and set to `contents: read` only.

## Testing Strategy

- **No unit tests** — artifact is a visual spec + orchestration shell script. Exercising it against real builds is the only meaningful test.
- **Manual verification per task** — each task lists the concrete check (local run, smoke PR).
- **Gradient mask smoke** — after Task 4, run the workflow locally once with the mask list commented out; confirm the run fails purely due to gradient variance. Re-enable mask; confirm it passes.
- **Red + green smoke PRs** in Task 7 prove the check actually catches regressions and doesn't false-positive on a no-op change.

## Progress Tracking

- Mark completed items with `[x]` immediately.
- Add newly discovered tasks with ➕ prefix.
- Document blockers with ⚠️ prefix.
- Update plan if scope changes.

## What Goes Where

- **Implementation Steps** (`[ ]`): code, workflow YAML, Playwright config, deps, docs edits.
- **Post-Completion** (no checkboxes): GitHub branch protection rule (repo-settings UI action, not automatable).

## Implementation Steps

### Task 1: Add Playwright + pixelmatch dependencies and base config

- [ ] `npm install --save-dev @playwright/test pixelmatch pngjs @types/pixelmatch @types/pngjs`
- [ ] add `playwright.config.ts` at repo root with `testDir: 'tests/visual'`, `fullyParallel: false` (serial — we run two full builds back-to-back), `reporter: [['html', { open: 'never' }], ['github']]`, two projects `desktop` (1280×800) and `mobile` (iPhone 13 device), output dir `test-results/`
- [ ] add to top-level `.gitignore`: `test-results/`, `playwright-report/`, `playwright/.cache/`, `tests/visual/shots/`
- [ ] add npm scripts: `"test:visual": "playwright test"`, `"test:visual:install": "playwright install --with-deps chromium"`
- [ ] verify: `npx playwright --version` runs; `npm run test:visual` with no test files exits 0

### Task 2: Add `data-visual-mask` attribute to the gradient Section

- [ ] edit `src/app/[lang]/page.tsx:67`: add `data-visual-mask="gradient"` to the existing `<Section className="bg-beautiful-gradient ...">` — attribute only, no behavior change
- [ ] verify: `npm run typecheck && npm run lint` pass; page renders identically in `npm run dev`

### Task 3: Implement the screenshot-capture spec

- [ ] create `tests/visual/capture.spec.ts` — single spec that, for each locale (`be`, `nl`) and each configured Playwright project (viewport), navigates to `${BASE_URL}/${locale}` and saves a screenshot
- [ ] spec reads two env vars: `BASE_URL` (where to hit — localhost during CI), and `SHOTS_DIR` (where to write PNGs; set per-side by the caller to `shots/baseline` or `shots/candidate`)
- [ ] before screenshot: `waitForLoadState('networkidle')`, then `page.evaluate(() => document.fonts.ready)`, then 500 ms pause for any fade-ins
- [ ] screenshot options: `{ fullPage: true, mask: [page.locator('[data-visual-mask="gradient"]')], animations: 'disabled', caret: 'hide' }`
- [ ] filename pattern: `home-${locale}-${projectName}.png` under `SHOTS_DIR`
- [ ] verify: `BASE_URL=http://localhost:3000 SHOTS_DIR=/tmp/shots-test npm run test:visual` on a local `npm run dev` produces 4 PNGs (`home-be-desktop.png`, `home-be-mobile.png`, `home-nl-desktop.png`, `home-nl-mobile.png`)

### Task 4: Implement the compare script

- [ ] create `tests/visual/compare.ts` — Node script run via `tsx` (or compile step; prefer adding `tsx` as a dev dep if not already present)
- [ ] takes two directories (`baselineDir`, `candidateDir`) and an output `diffDir`; iterates over PNGs in `baselineDir`
- [ ] for each file: decode both PNGs via `pngjs`, run `pixelmatch` with `{ threshold: 0.1 }`, write diff PNG to `diffDir/<name>.diff.png`
- [ ] fail threshold: `diffPixels / totalPixels > 0.001` (0.1 %); log per-file result (OK / FAIL with pixel count and ratio)
- [ ] exit 1 on any failure, 0 on all pass; also writes a `summary.txt` listing each file + result for artifact readability
- [ ] handle size mismatch (baseline and candidate viewports diverged): treat as failure with a clear error message
- [ ] handle missing candidate file: fail with clear error; a missing baseline file means the page is new — skip with a note
- [ ] verify: manually create two PNG dirs with an identical pair and a deliberately-different pair; script correctly passes the identical and fails the different

### Task 5: Add the `visual` CI job to `.github/workflows/ci.yml`

- [ ] add a new `visual` job alongside `lint` and `test`; `runs-on: ubuntu-latest`; explicit top-level `permissions: contents: read` on the workflow, and **no** job-level elevation
- [ ] workflow steps (in order):
  1. `actions/checkout@v4` with `fetch-depth: 0` (needed to check out main into a worktree)
  2. `actions/setup-node@v4` with project's Node version and `cache: npm`
  3. `npm ci`
  4. `npx playwright install --with-deps chromium`
  5. Build PR side: `npm run build`
  6. Start PR server: `npm start -- --port 3100 &` then `npx wait-on http://localhost:3100/be` with a 60 s timeout
  7. Capture candidate shots: `BASE_URL=http://localhost:3100 SHOTS_DIR=shots/candidate npm run test:visual`
  8. Kill PR server (`pkill -f "next start"` or track PID)
  9. `git worktree add ../main-worktree origin/main`
  10. `cd ../main-worktree && npm ci && npm run build && npm start -- --port 3101 &` then `npx wait-on http://localhost:3101/be`
  11. Capture baseline shots (back in PR repo): `BASE_URL=http://localhost:3101 SHOTS_DIR=shots/baseline npm run test:visual`
  12. Kill main server
  13. Compare: `npx tsx tests/visual/compare.ts shots/baseline shots/candidate shots/diff`
  14. Always (`if: always()`): upload `shots/` as artifact named `visual-<sha>`
- [ ] job timeout: 20 min (two builds + screenshots)
- [ ] `concurrency` keyed on `pr-<PR number>` to cancel outdated runs when the PR is pushed to
- [ ] verify: push a no-op PR (comment-only change) — workflow runs green, artifact contains 8 PNGs (4 baseline + 4 candidate) and an empty `diff/`

### Task 6: Mitigate Sanity-content drift between the two builds (optional, only if needed)

*Only do this task if Task 5 shows false-positive failures from Sanity content changing between the two captures. In practice the two captures run within ~5 min of each other, and Sanity edits on this site are rare — expected to be a non-issue.*

- [ ] run several live PRs, track false-positive rate from content drift
- [ ] if drift is observed: introduce a simple fetch proxy. Start a tiny local HTTP proxy in the workflow that caches Sanity responses. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` / API host override to point at the proxy for both builds. First build populates the cache, second build replays. Put the proxy in `tests/visual/sanity-proxy.ts`
- [ ] verify: simulate Sanity change between captures locally by deliberately editing a response; proxy replays cached response; comparison stays green

### Task 7: Prove the check catches regressions

- [ ] create throwaway PR `visual-regression-smoke-red` that visibly changes the home page (shift hero padding by 24 px or change a heading color via token override)
- [ ] confirm the `visual` job fails; download the artifact; visually inspect the diff PNG is recognizable
- [ ] close the PR without merging
- [ ] create throwaway PR `visual-regression-smoke-green` with a comment-only change — confirm the workflow passes

### Task 8: Documentation

- [ ] add a **Visual regression** entry under `## Commands` in `CLAUDE.md`: how to run locally (`npm run test:visual:install` once, then `BASE_URL=http://localhost:3000 SHOTS_DIR=/tmp/out npm run test:visual`); how to add a new page (add to the spec's locales/pages array); how to add a new mask (`data-visual-mask="<name>"` + extend the mask list in `capture.spec.ts`)
- [ ] add a short note in `CLAUDE.md` under `## Architectural Decisions (Non-Obvious)` explaining: the `visual` job runs two full `next build`s per PR (expected cost); why no staging branch (security); what to do if the check is flaky (re-run once, then investigate — likely Sanity drift, see Task 6)
- [ ] no README.md changes

### Task 9: Verify acceptance criteria

- [ ] check smoke PRs from Task 7: red one failed, green one passed
- [ ] confirm 4 test cases run per side in workflow log (2 locales × 2 viewports)
- [ ] confirm gradient is masked in uploaded artifact PNGs (visual inspection)
- [ ] confirm workflow finishes within 20 min on a typical PR
- [ ] confirm workflow has `permissions: contents: read` at the top and no elevations anywhere
- [ ] `npm run lint && npm run typecheck && npm run test` all pass

## Technical Details

**Why two builds in one runner, not two URLs**

Earlier we considered comparing the PR's Vercel preview URL to a stable URL for `main`. The two options for that stable URL (auto-fast-forwarded `staging` branch, or Vercel API-triggered redeploy) both required a write-scoped token somewhere. This approach avoids that entirely: the workflow only reads the repo.

**Why `git worktree` instead of `git checkout main`**

Checkout replaces the working tree, which means `node_modules` installed for the PR build would be re-used for main — risky if dependencies changed. A worktree gives us a separate dir where we can do a clean `npm ci` for main. It also means we can optionally run both servers simultaneously in future revisions.

**Masking**

`mask: [page.locator('[data-visual-mask="gradient"]')]` paints the masked region a fixed color at screenshot time in both captures, so pixels inside are identical by construction. If another gradient or animated surface is added, the fix is: add `data-visual-mask="<name>"` to the element, extend the `mask: [...]` array in `capture.spec.ts`. Documented in Task 8.

**Diff threshold**

`pixelmatch` with `threshold: 0.1` (per-pixel sensitivity, standard setting). Global threshold `diffPixels / totalPixels > 0.001` (0.1 %). At 1280×800 that's ~1024 pixels — smaller than a typical single-glyph shift. Can tighten later if false positives are rare.

**CI permissions**

```yaml
permissions:
  contents: read
```

Declared at workflow level, no job-level elevation. The `GITHUB_TOKEN` given to the runner is read-only. Artifact upload uses `actions/upload-artifact` which does not require repo-write.

**Node process lifecycle**

`next start &` with `pkill -f "next start"` is crude but sufficient; if it proves flaky, switch to writing PID to a file and `kill -TERM` that PID. `wait-on` polls the readiness endpoint rather than sleeping blindly.

## Post-Completion

*Manual repo-settings action — not automatable.*

**GitHub branch protection**
- In repo settings → Branches → `main`, add the new `visual` status check to "Require status checks to pass before merging". Without this, the test runs but does not block merges.

**Ongoing maintenance**
- If Sanity content edits start causing frequent false positives: revisit Task 6 (Sanity proxy).
- When adding a new page or viewport: extend the locale/page array in `tests/visual/capture.spec.ts` and the Playwright `projects` list in `playwright.config.ts` respectively. No other config change needed.
- When adding a new animated/gradient component: add `data-visual-mask="<unique-name>"` in JSX and append `page.locator('[data-visual-mask="<unique-name>"]')` to the `mask: [...]` array in `capture.spec.ts`.