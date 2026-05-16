# MARA Website - Belarusians in the Netherlands

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/vmid.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

## Overview

Website for MARA - a non-profit organization of Belarusians in the Netherlands. Built with Next.js, TypeScript, and Sanity CMS.

## Technologies

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Language**: TypeScript
- **CMS**: Sanity
- **Authentication**: Clerk
- **Payments**: Stripe
- **Internationalization**: i18next
- **Testing**: Jest
- **Storage**: AWS S3
- **Email**: Google APIs

## Project Structure

- `/src/app` - Next.js app router structure
- `/src/app/[lang]` - Internationalized routes (be, nl)
- `/src/app/(sanity)/studio` - Sanity Studio admin interface
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and integrations
- `/src/sanity` - Sanity schema definitions and services
- `/src/i18n` - Translation files and i18n configuration

## Local Development

### Prerequisites

* [Node.js](https://nodejs.org/en/) 24
* [pnpm](https://pnpm.io/) (managed via Corepack — `corepack enable` picks up the version pinned in `package.json`)

### Getting Started

1. Install dependencies:
   ```
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.development` to `.env.local` and update necessary values

3. Start the development server:
   ```
   pnpm dev
   ```

   For faster compilation with Turbo:
   ```
   pnpm dev:turbo
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix linting issues
- `pnpm test` - Run tests
- `pnpm typecheck` - Check TypeScript types

## Deployment

The application is configured for deployment on platforms supporting Node.js applications.

## Code Style

- Follows strict TypeScript rules
- Uses Prettier for formatting
- 120 character line length
- Single quotes
- 2-space indentation

## License

See the [LICENSE](LICENSE) file for details.