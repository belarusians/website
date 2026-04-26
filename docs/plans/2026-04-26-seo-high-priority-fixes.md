# SEO high-priority fixes (issue #142)

## Overview

Resolve the 7 unfixed high-priority items from issue #142 (`SEO Audit`). Critical items were addressed in PR #147; medium items are deferred to a separate plan.

Items in scope:

- **#9** Sitemap `lastModified` always returns `new Date()` — replace with real `_updatedAt` from Sanity for dynamic URLs.
- **#10** No Organization/NonprofitOrganization JSON-LD in root layout — add alongside existing `WebSite` schema.
- **#11** News articles default to `og:type: 'website'` and don't set `publishedTime` — set `type: 'article'` + `publishedTime` from `publishingDate`.
- **#12** Event detail pages default to `og:type: 'website'` — set `type: 'article'`.
- **#13** No `Event` structured data on event detail pages — add JSON-LD with name, dates, location, image.
- **#14** No `JobPosting` structured data on vacancy detail pages — add JSON-LD with title, description, hiringOrganization.
- **#15** `robots.txt` blocks `/_next/` — Google needs CSS/JS to render; allow it.

Out of scope (medium-priority, separate plan): sign-in/up `noindex`, localized keywords, twitter:site, BreadcrumbList, og:locale:alternate, loading.tsx, robots.txt `/*.json$`, og:url absolute paths.

## Context (from discovery)

Files involved and what each contributes:

- `src/app/sitemap.ts:10-23` — `generateTranslatedUrls` helper hardcodes `lastModified: new Date()`. Called for both static routes and dynamic content (news/events/guides/vacancies).
- `src/sanity/event/service.ts:7-44` — `getAllEvents`, `getAllEventsSlugs`, `getFutureEventMetas` GROQ queries. None project `_updatedAt` today. `getEventBySlug` already does `...,` so `_updatedAt` is implicitly returned but not typed.
- `src/sanity/news/service.ts:8-9,68-82` — `getAllNewsSlugs`, `getAllNewsMetas`. No `_updatedAt` projection.
- `src/sanity/guide/service.ts` — slugs query needs the same treatment.
- `src/sanity/vacancy/service.ts:5-9` — `getAllVacancies` returns only `id`. Needs `_updatedAt`.
- `src/app/layout.tsx:26-36,68` — `addJsonLd()` builds the minimal `WebSite` script, rendered via `<Script id="website-jsonld" type="application/ld+json">`. Add a second `<Script>` block for Organization, or extend the JSON-LD to a graph.
- `src/app/[lang]/news/[slug]/page.tsx:54-79` — `generateMetadata` for news; spreads `parentMetadata.openGraph` (which sets `type: 'website'` in root layout). Needs `type: 'article'` override + `publishedTime`. `News.publishingDate` is already on the schema (`src/sanity/news/schema.ts:84-89`).
- `src/app/[lang]/events/[slug]/page.tsx:56-94` — same pattern for events. Event timeframe lives on the schema as `timeframe.start`/`timeframe.end` (`src/sanity/event/schema.ts:65-70`). Use these for both `publishedTime` and Event JSON-LD `startDate`/`endDate`.
- `src/app/[lang]/vacancies/[id]/page.tsx:44-74` — vacancy page metadata; needs JobPosting JSON-LD inserted into the rendered tree.
- `src/app/robots.txt:5-7` — `Disallow: /_next/` is the offending rule. `/api/` block stays (auth/secrets).
- `sanity.config.ts` — `EventSchema`, `NewsSchema`, `VacancySchema` exports. `_updatedAt` is a built-in Sanity system field; no schema change needed, but TypeGen types may need regeneration if we project it.

Related patterns:

- All page metadata follows the same pattern: `generateMetadata({ params }, parent)` → spread `parentMetadata.openGraph` → override fields. So adding `type: 'article'` is one line per page.
- Existing JSON-LD on root layout uses raw `<Script type="application/ld+json" dangerouslySetInnerHTML>` — keep this style for consistency.
- Sanity service files use `groq` template literal where types matter; `_updatedAt` is a string ISO-8601 field on every document.
- Tests live in `__tests__/` directories with `.test.ts[x]`. There is a `src/app/__tests__/sitemap.test.ts`-style precedent? — none currently. JSON-LD validity is best verified by snapshotting the generated object, not the rendered HTML.

Dependencies / external:

- `_updatedAt` is automatic — no schema or CMS change. But ISR cache must invalidate on document publish for the sitemap to reflect changes; existing webhook revalidation on `event`/`news`/`guide`/`vacancy` tags already covers this.
- `next/types` `Metadata.openGraph` accepts `type: 'article'` and `publishedTime` (ISO 8601). Currently the code uses `// @ts-ignore` on the openGraph spread — that comment can stay; this just adds fields to the same object.

## Development Approach

- **Testing approach**: Regular (code first, then tests where they add value). JSON-LD builders get unit tests asserting the produced object matches schema.org shape. Pure metadata field additions (og:type, publishedTime) are verified by inspection + a single snapshot test per page if useful.
- Complete each task fully before moving to the next.
- Make small, focused changes — one issue per task.
- **CRITICAL: every task that introduces logic MUST include tests.** Pure config/declarative changes (robots.txt edit, og:type literal) are verified by inspection and noted per-task.
- **CRITICAL: all tests must pass before starting next task** — no exceptions.
- **CRITICAL: update this plan file when scope changes during implementation.**
- Run `npm run lint` and `npm run typecheck` after each change.
- Run `npm run sanity:types` after any GROQ query change that affects projected fields, so TypeGen reflects new `_updatedAt` projections.

## Testing Strategy

- **Unit tests** (Jest, per `npm run test`):
  - Sitemap: assert that dynamic entries (news/events/guides/vacancies) carry `lastModified` derived from `_updatedAt` when present, and that static entries fall back to a stable date (build-time constant or `new Date()` — see Task 1).
  - JSON-LD builders (Organization, Event, JobPosting): assert generated objects include required schema.org fields and reflect input.
- **Integration / snapshot**:
  - One snapshot test per dynamic detail page's `generateMetadata` to lock `og:type` and `publishedTime` (avoid regressions).
- **No e2e framework** in repo — skip.
- **Manual verification** (Post-Completion):
  - Validate JSON-LD via Google Rich Results Test on a deployed preview URL for: home (Organization), `/be/events/<slug>` (Event), `/be/vacancies/<id>` (JobPosting).
  - Validate sitemap via `curl https://www.belarusians.nl/sitemap.xml | head` and confirm `<lastmod>` varies per URL.
  - Re-pull `https://www.belarusians.nl/robots.txt` and verify `/_next/` is reachable.

## Progress Tracking

- Mark completed items with `[x]` immediately when done.
- Add newly discovered tasks with ➕ prefix.
- Document blockers with ⚠️ prefix.
- Update plan if implementation deviates.

## What Goes Where

- **Implementation Steps** (`[ ]`): automatable code, test, and config changes within this repo.
- **Post-Completion** (no checkboxes): Rich Results Test verification, deployed sitemap inspection, manual robots.txt fetch.

## Implementation Steps

### Task 1: Allow `/_next/` in robots.txt (#15)

Smallest mechanical fix. Done first to land an immediate Lighthouse win.

- [x] remove `Disallow: /_next/` line from `src/app/robots.txt:6`
- [x] keep `Disallow: /api/` (still desirable)
- [x] add a brief comment above the kept disallows clarifying *why* `/_next/` is now allowed (Google needs CSS/JS) — one-line comment max
- [x] no unit test (static text file) — verified by inspection
- [x] run `npm run lint` and `npm run typecheck` — must pass before next task

### Task 2: Project `_updatedAt` from Sanity services

Prerequisite for Task 3. Touch each service file to add `_updatedAt` to GROQ projections that feed the sitemap.

- [x] add `_updatedAt,` to GROQ projection in `src/sanity/event/service.ts`:`getAllEventsSlugs`
- [x] add `_updatedAt,` to GROQ projection in `src/sanity/news/service.ts`:`getAllNewsSlugs`
- [x] add `_updatedAt,` to GROQ projection in `src/sanity/guide/service.ts` (the slugs query used by sitemap)
- [x] update `src/sanity/vacancy/service.ts`:`getAllVacancies` to project `_updatedAt`
- [x] update return-type annotations on each function from `{ slug: string }[]` / `Vacancy[]` to include `updatedAt: string` (or keep `_updatedAt` field name — pick one and be consistent)
- [x] run `npm run sanity:types` to regenerate TypeGen types
- [x] add a unit test asserting the projection shape for each service (mock `sanityFetch` and assert returned objects include `_updatedAt`) — one test file `src/sanity/__tests__/services-updated-at.test.ts`
- [x] run `npm run test` and `npm run typecheck` — must pass before next task

### Task 3: Use real `lastModified` in sitemap (#9)

- [x] change `src/app/sitemap.ts` so dynamic loops pass `_updatedAt` (parsed to `Date`) into a per-URL entry instead of calling `generateTranslatedUrls` for dynamic content
- [x] keep `generateTranslatedUrls` for static routes; replace `new Date()` inside it with a stable build-time constant (`const BUILD_TIME = new Date()` at module scope) — avoids "now" recomputed per request
- [x] for dynamic items missing `_updatedAt` (defensive — shouldn't happen), fall back to `BUILD_TIME`
- [x] write `src/app/__tests__/sitemap.test.ts`:
  - assert dynamic news entry uses its `_updatedAt` for `lastModified`
  - assert static `/about-us` entry uses `BUILD_TIME`
  - assert URL count matches expected (static + dynamic per locale)
- [x] run `npm run test` and `npm run typecheck` — must pass before next task

### Task 4: Add Organization JSON-LD to root layout (#10)

- [x] in `src/app/layout.tsx`, extend the existing JSON-LD payload to a `@graph` containing both the existing `WebSite` and a new `NonprofitOrganization` entry — single `<Script>` tag, single graph
- [x] Organization fields: `@type: 'NonprofitOrganization'`, `name: 'MÁRA'`, `url: 'https://www.belarusians.nl/'`, `logo`, `sameAs` (Facebook, Instagram, Twitter URLs already used in `about-us/page.tsx`), `email: 'mara@belarusians.nl'`, `address` (PostalAddress, Netherlands; if no street kept on file, use `addressCountry: 'NL'` only)
- [x] extract the JSON-LD object into a small builder `buildSiteJsonLd()` in the same file (or `src/lib/jsonld.ts` if other tasks need it — see Task 5/6)
- [x] write `src/lib/__tests__/jsonld.test.ts` (or colocated): assert builder output has `@context`, `@graph` with two entries, `NonprofitOrganization` includes name/url/logo/sameAs
- [x] run `npm run test` and `npm run typecheck` — must pass before next task

### Task 5: Set news `og:type: 'article'` + `publishedTime` (#11)

- [x] in `src/app/[lang]/news/[slug]/page.tsx`:`generateMetadata`, add `type: 'article'` and `publishedTime: news.publishingDate` to the `openGraph` object (only when `news` exists; default branch keeps inherited type)
- [x] write a snapshot/assertion test: invoke `generateMetadata` with a stub news object, assert `openGraph.type === 'article'` and `openGraph.publishedTime` matches input
- [x] run `npm run test` and `npm run typecheck` — must pass before next task

### Task 6: Set event `og:type: 'article'` + add Event JSON-LD (#12, #13)

- [ ] in `src/app/[lang]/events/[slug]/page.tsx`:`generateMetadata`, add `type: 'article'` to `openGraph` (only when `event` exists)
- [ ] add an `EventArticle`-adjacent `<Script type="application/ld+json">` block in the page render path with Event JSON-LD: `@type: 'Event'`, `name: event.title`, `description: event.description`, `startDate: event.timeframe.start`, `endDate: event.timeframe.end`, `eventStatus`: pick from `cancelled` / `rescheduled` / default to `EventScheduled`, `location: { @type: 'Place', name: event.location }`, `image: urlForImage(event.backgroundUrl)`
- [ ] add `eventJsonLd(event)` builder to `src/lib/jsonld.ts`
- [ ] unit test for `eventJsonLd`: assert all required fields, status mapping for cancelled/rescheduled
- [ ] run `npm run test` and `npm run typecheck` — must pass before next task

### Task 7: Add JobPosting JSON-LD to vacancy pages (#14)

- [ ] add `jobPostingJsonLd(vacancy, lang)` builder to `src/lib/jsonld.ts`: `@type: 'JobPosting'`, `title: vacancy.title`, `description: vacancy.description` (concatenate `tasks` for richer text), `hiringOrganization: { @type: 'NonprofitOrganization', name: 'MÁRA', sameAs: 'https://www.belarusians.nl/' }`, `jobLocation: { @type: 'Place', address: { @type: 'PostalAddress', addressCountry: 'NL' } }`, `datePosted: vacancy._updatedAt` (or `_createdAt` if available — see note below), `employmentType: 'VOLUNTEER'` (vacancies are non-paid; confirm during impl)
- [ ] in `src/app/[lang]/vacancies/[id]/page.tsx`, render the JSON-LD via a `<Script type="application/ld+json">` inside the page tree (only when vacancy exists)
- [ ] project `_createdAt` and `_updatedAt` in `getVacancyById` (extends Task 2 work)
- [ ] unit test for `jobPostingJsonLd`: required fields present, `employmentType` correct, `hiringOrganization.name === 'MÁRA'`
- [ ] run `npm run test` and `npm run typecheck` — must pass before next task

### Task 8: Verify acceptance criteria

- [ ] verify all 7 issue items addressed (cross-reference Overview list)
- [ ] run full `npm run test` — all green
- [ ] run `npm run lint` — clean
- [ ] run `npm run typecheck` — clean
- [ ] run `npm run build` locally — must succeed (catches metadata-related Next.js complaints)
- [ ] inspect built sitemap output: `curl http://localhost:3000/sitemap.xml | head -40` after `npm run start`, confirm `lastmod` varies

### Task 9: [Final] Update documentation

- [ ] update `CLAUDE.md` "Architectural Decisions" with one short bullet for "JSON-LD lives inline per page; builders in `src/lib/jsonld.ts`" — only if a future contributor would otherwise miss the pattern
- [ ] no README change needed

*Note: ralphex automatically moves completed plans to `docs/plans/completed/`*

## Technical Details

### Sitemap shape after Task 3

```ts
// src/app/sitemap.ts (sketch)
const BUILD_TIME = new Date();

function staticEntry(path: string): MetadataRoute.Sitemap {
  return [Lang.be, Lang.nl].map((lang) => ({
    url: `${baseUrl}${lang}${path}`,
    lastModified: BUILD_TIME,
  }));
}

function dynamicEntry(path: string, updatedAt: string): MetadataRoute.Sitemap {
  return [Lang.be, Lang.nl].map((lang) => ({
    url: `${baseUrl}${lang}${path}`,
    lastModified: new Date(updatedAt),
  }));
}
```

### Organization JSON-LD shape (Task 4)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "name": "MÁRA", "url": "https://www.belarusians.nl/" },
    {
      "@type": "NonprofitOrganization",
      "name": "MÁRA",
      "url": "https://www.belarusians.nl/",
      "logo": "https://www.belarusians.nl/logo/og-image.png",
      "email": "mara@belarusians.nl",
      "sameAs": [
        "https://facebook.com/marabynl",
        "https://www.instagram.com/marabynl/",
        "https://twitter.com/marabynl"
      ],
      "address": { "@type": "PostalAddress", "addressCountry": "NL" }
    }
  ]
}
```

### Event JSON-LD shape (Task 6)

Status mapping:
- `event.cancelled` → `eventStatus: 'https://schema.org/EventCancelled'`
- `event.rescheduled` → `eventStatus: 'https://schema.org/EventRescheduled'` + `previousStartDate: event.timeframe.start`, `startDate: event.rescheduledTimeframe.start`
- otherwise → `eventStatus: 'https://schema.org/EventScheduled'`

### JobPosting nuance

`employmentType` per schema.org is one of `FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN | VOLUNTEER | PER_DIEM | OTHER`. Use `'VOLUNTEER'` since these are unpaid; confirm with the user during Task 7 if any vacancy is paid.

`datePosted` is required by Google's Rich Results spec; use `_createdAt` as the post date and `validThrough` left empty (vacancies stay open until removed).

## Post-Completion

*Items requiring manual intervention or external systems — no checkboxes, informational only.*

**Manual verification**:

- Deploy to a Vercel preview branch.
- Validate JSON-LD with Google Rich Results Test:
  - homepage → expect `Organization` detected
  - one event detail URL → expect `Event` detected with date/location
  - one vacancy detail URL → expect `JobPosting` detected
- Validate sitemap: `curl https://<preview>.vercel.app/sitemap.xml | head -60` — confirm `<lastmod>` reflects real Sanity update times, not "now".
- Validate robots.txt: `curl https://<preview>.vercel.app/robots.txt` — confirm `/_next/` is no longer disallowed.
- Re-run Lighthouse SEO audit on home + one event + one vacancy — should remain ≥97.

**External system updates**:

- After merge, monitor Google Search Console for new structured-data detections under "Enhancements" (Events, JobPostings) — typically appears within 1–2 weeks of recrawl.
- Sanity webhook revalidation already covers content tags; no config change needed.

**Follow-up plan** (not in scope here):

- Medium-priority items from issue #142 (sign-in/up `noindex`, localized keywords, twitter:site, BreadcrumbList, og:locale:alternate, loading.tsx, robots.txt `/*.json$`, og:url absolute paths) — file as a separate plan.
- Inline-`<div>Not found</div>` and `<h1>404</h1>` in `news/[slug]`, `events/[slug]`, `vacancies/[id]` should call `notFound()` so the global `not-found.tsx` is used — small follow-up, not part of this plan since it's a critical-tier loose end.
