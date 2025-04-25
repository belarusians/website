# MARA Website - Belarusians in the Netherlands

![](https://api.checklyhq.com/v1/badges/checks/c0e712fd-886e-4831-ba67-578b1f84879e?style=flat&theme=default&responseTime=true)
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

* [Node.js](https://nodejs.org/en/) 20+

### Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.development` to `.env.local` and update necessary values

3. Start the development server:
   ```
   npm run dev
   ```
   
   For faster compilation with Turbo:
   ```
   npm run dev:turbo
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run test` - Run tests
- `npm run typecheck` - Check TypeScript types

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