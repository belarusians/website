# Project Structure

This document provides an overview of the MARA website project structure.

## Root Directory

- `src/` - Source code
- `public/` - Static assets
- `docs/` - Documentation
- `migration/` - Database migration scripts
- `dumps/` - Database dumps
- `.next/` - Next.js build directory (generated)

## Configuration Files

- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - NPM package definition
- `sanity.config.ts` - Sanity CMS configuration
- `sanity.cli.ts` - Sanity CLI configuration
- `postcss.config.js` - PostCSS configuration
- `jest.config.js` - Jest test configuration
- `next-env.d.ts` - Next.js TypeScript definitions
- `CLAUDE.md` - Claude AI assistant instructions
- `.env.*` - Environment variables for different environments

## Source Code Structure

### Application (`src/app/`)

Next.js App Router structure:

- `src/app/[lang]/` - Internationalized routes
  - `page.tsx` - Home page
  - `about-us/` - About us page
  - `donate/` - Donation page
  - `events/` - Events page and individual event pages
  - `join-us/` - Join us page
  - `news/` - News page and individual news articles
  - `sign-in/` - Authentication
  - `sign-up/` - Registration
  - `vacancies/` - Vacancies and individual vacancy pages
  - `events-block.tsx`, `news-block.tsx`, etc. - Page components

- `src/app/(sanity)/` - Sanity CMS routes
  - `studio/` - Sanity Studio administration interface

- `src/app/api/` - API routes
  - `clickmeeting/` - ClickMeeting integration
  - `donate/` - Donation handling
  - `revalidate/` - Cache revalidation
  - `subscribe/` - Newsletter subscription
  - `vacancies/` - Vacancy applications
  - `webhooks/` - Webhook handlers

### Components (`src/components/`)

Reusable UI components:

- `button.tsx` - Button component
- `card.tsx` - Card component
- `dropdown.tsx` - Dropdown component
- `globals.css` - Global styles
- `header/` - Header components
- `headings/` - Heading components
- `menu/` - Menu components
  - `desktop/` - Desktop menu
  - `mobile/` - Mobile menu
- `section.tsx` - Section component
- `spinner.tsx` - Loading spinner
- `language-selector.tsx` - Language selection
- `image.tsx` - Image component
- `types.ts` - Component type definitions
- `utils.ts` - Utility functions

### Sanity CMS (`src/sanity/`)

Sanity schema definitions and services:

- `client.ts` - Sanity client configuration
- `env.ts` - Environment variables
- `event/` - Event schema and services
- `feedback/` - Feedback schema and services
- `news/` - News schema and services
- `vacancy/` - Vacancy schema and services
- `locale-schemas/` - Internationalization schemas
- `lib/` - Utility functions
- `timeframe.ts` - Timeframe schema

### Internationalization (`src/i18n/`)

Translation files and configuration:

- `client.ts` - Client-side i18n setup
- `index.ts` - i18n configuration
- `settings.ts` - i18n settings
- `locales/` - Translation files
  - `be/` - Belarusian translations
  - `nl/` - Dutch translations

### Libraries and Utilities (`src/lib/`)

Utility functions and integrations:

- `clickmeeting.ts` - ClickMeeting API integration
- `email.ts` - Email handling
- `google-directory.ts` - Google Directory integration
- `s3.ts` - AWS S3 integration
- `stripe.ts` - Stripe payment integration
- `utils.ts` - Utility functions
- `vacancies.ts` - Vacancy handling
- `__tests__/` - Test files

### Utilities (`src/utils/`)

Additional utility functions:

- `og.ts` - Open Graph image generation

### Middleware (`src/middleware.ts`)

Next.js middleware for request processing, including:
- Authentication with Clerk
- Internationalization handling
- API route protection

## Public Directory (`public/`)

Static assets:

- `icons/` - Favicon and app icons
- `images/` - Static images
- `logo/` - Logo files
- `partners/` - Partner logos
- `manifest.json` - PWA manifest
- `browserconfig.xml` - Browser configuration
- `targets.pdf` - Static PDF document

## Tests

Tests are located alongside the code they test:

- `src/lib/__tests__/` - Library tests
- Test files use the `.test.ts` extension

## Dockerfile

Container definition for deployment.