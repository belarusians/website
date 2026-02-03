# SEO Audit Report

Full audit of www.belarusians.nl — codebase analysis + live website scraping. 23 issues found, categorized by severity.

---

## Critical (7 issues)

### 1. `robots.txt` blocks the sitemap
**File:** `src/app/robots.txt`
`Disallow: /*.xml$` blocks **all** XML files, including `/sitemap.xml` — which is declared on the very next line via `Sitemap: https://www.belarusians.nl/sitemap.xml`. Search engines are told not to crawl the sitemap they're told to read.

### 2. Missing `lang` attribute on `<html>` tag
**File:** `src/app/layout.tsx:41`
The root layout renders `<html>` without a `lang` attribute. Since it sits above the `[lang]` route segment, the language is never passed to the HTML element. Hurts accessibility (screen readers) and SEO (language detection).

### 3. Homepage has no H1 tag
**File:** `src/app/[lang]/page.tsx`
The homepage renders `FeaturedNewsBlock`, `EventsBlock`, `AchievementsBlock`, etc. — all using H2 headings. There is no `<h1>` anywhere on the page.

### 4. About Us page has no unique title or description
**File:** `src/app/[lang]/about-us/page.tsx:89-101`
`generateMetadata` only sets `alternates`. Does not override `title`, `description`, `openGraph`, or `twitter`. Inherits the homepage's generic metadata, making it indistinguishable in search results.

### 5. Alien Passport page has no unique title or description
**File:** `src/app/[lang]/alien-passport/page.tsx:31-43`
Same issue as About Us — `generateMetadata` only sets `alternates`. Also contains FAQ-style content that could benefit from `FAQPage` structured data but has none.

### 6. News listing page does not exist (returns 404)
There is no `src/app/[lang]/news/page.tsx`. Visiting `/be/news` or `/nl/news` returns a 404. Every other content type (events, guides, vacancies) has a listing page, but news does not.

### 7. No custom 404 page
No `not-found.tsx` exists. Dynamic pages return inline `<div>Not found</div>` or `<h1>404</h1>` — no navigation, no SEO-friendly content, no link equity redistribution.

---

## High Priority (8 issues)

### 8. Sitemap missing pages
**File:** `src/app/sitemap.ts:42-52`
Missing from sitemap: `/guides`, `/guides/[slug]`, `/kupalle`, `/alien-passport`.

### 9. Sitemap `lastModified` always returns current date
**File:** `src/app/sitemap.ts:15`
Every URL gets `lastModified: new Date()` — always "now". Should use actual content modification dates from Sanity.

### 10. No Organization/NonprofitOrganization structured data
**File:** `src/app/layout.tsx:25-35`
Only JSON-LD is a minimal `WebSite` schema. Missing: `Organization` or `NonprofitOrganization` with logo, social profiles, contact info, address.

### 11. News articles missing `og:type: 'article'` and `publishedTime`
**File:** `src/app/[lang]/news/[slug]/page.tsx:64-69`
News articles default to `og:type: 'website'` and don't set `publishedTime`. Only guide pages correctly use `type: 'article'`.

### 12. Event articles missing `og:type: 'article'`
**File:** `src/app/[lang]/events/[slug]/page.tsx:78-83`
Event detail pages use default `og:type: 'website'` instead of `'article'`.

### 13. No Event structured data on event pages
Event detail pages should include `Event` JSON-LD (date, location, offers). Google displays event rich snippets directly in search results.

### 14. No JobPosting structured data on vacancy pages
**File:** `src/app/[lang]/vacancies/[id]/page.tsx`
Should include `JobPosting` JSON-LD. Google supports job posting rich results.

### 15. `robots.txt` blocks `/_next/` static assets
**File:** `robots.txt:6`
Blocking `/_next/` prevents Google from accessing CSS/JS needed to render pages. Google recommends allowing access to these resources.

---

## Medium Priority (8 issues)

### 16. Sign-in / Sign-up pages have no metadata and no `noindex`
Auth pages have no `generateMetadata`, no title/description, and no `robots: { index: false }`. Should be explicitly noindexed.

### 17. Keywords not localized
**File:** `src/app/layout.tsx:121`
Same English keywords for all languages. Yandex (relevant for Belarusian audience) still considers meta keywords.

### 18. `og:url` uses relative paths inconsistently
Pages like donate, events set `og:url` as relative paths (e.g., `` `${lang}/donate` ``). OG protocol spec requires absolute URLs.

### 19. No `twitter:site` tag
No `twitter:site` meta tag set despite having a Twitter/X account.

### 20. No BreadcrumbList structured data
Clear hierarchy exists but no breadcrumb structured data for rich snippets.

### 21. No `og:locale:alternate` tags
Hreflang is correct, but `og:locale:alternate` (used by Facebook for international content) is not set.

### 22. No `loading.tsx` files
No loading states in any route directory. Affects Core Web Vitals (CLS) which impacts SEO.

### 23. `robots.txt` blocks `/*.json$`
Blocks `/manifest.json`, interfering with PWA indexing.

---

## Page-by-Page Summary

| Page | Title | Description | OG Tags | H1 | Structured Data | Canonical/Hreflang |
|------|-------|-------------|---------|----|-----------------|--------------------|
| Homepage | OK | OK | OK | **MISSING** | Minimal WebSite | OK |
| About Us | **INHERITED** | **INHERITED** | **WRONG og:url** | OK | None | OK |
| Alien Passport | **INHERITED** | **INHERITED** | **INHERITED** | OK | None (needs FAQPage) | OK |
| Donate | OK | OK | OK | OK | None | OK |
| Events listing | OK | OK | OK | OK | None | OK |
| Events detail | OK | OK | OK | Depends | None (needs Event) | OK |
| News listing | **404** | **404** | **404** | **404** | **404** | **404** |
| News detail | OK | OK | OK | Depends | None (needs Article) | OK |
| Guides listing | OK | OK | OK | OK | None | OK |
| Guides detail | OK | OK | OK (`type: article`) | Depends | None | OK |
| Join Us | OK | OK | OK (custom img) | OK | None | OK |
| Vacancies listing | OK | OK | OK (custom img) | OK | None | OK |
| Vacancies detail | OK | OK | OK | OK | None (needs JobPosting) | OK |
| Kupalle | OK | OK | OK | OK | None (needs Event) | OK |
| Sign-in | **MISSING** | **MISSING** | **INHERITED** | N/A | None | **MISSING** |
| Sign-up | **MISSING** | **MISSING** | **INHERITED** | N/A | None | **MISSING** |

---

## What's Working Well

- Hreflang/canonical implementation correct on all pages (x-default, be, nl)
- Localized titles and descriptions on most pages
- Dynamic OG images from Sanity CMS on event/news detail pages
- Custom static OG images on join-us and vacancies
- Dynamically generated sitemap from CMS content
- Google and Facebook verification tags present
- ISR + webhook revalidation for content freshness
- `generateStaticParams` on all dynamic routes
