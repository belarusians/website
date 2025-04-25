# Development Guide

This document provides guidelines for development on the MARA website project.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 9 or higher
- Git

### Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.development` to `.env.local`
   - Update the values in `.env.local` with appropriate credentials

### Development Workflow

1. Start the development server:
   ```bash
   npm run dev
   ```
   
   For faster compilation with Turbo mode:
   ```bash
   npm run dev:turbo
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Code Quality Tools

- **ESLint**: JavaScript/TypeScript linting
  ```bash
  npm run lint
  ```
  
  To automatically fix issues:
  ```bash
  npm run lint:fix
  ```

- **TypeScript**: Type checking
  ```bash
  npm run typecheck
  ```

- **Jest**: Testing framework
  ```bash
  npm run test
  ```
  
  To run a specific test:
  ```bash
  npx jest -t "test name pattern"
  ```

## Working with Sanity Studio

The Sanity Studio administration interface is available at `/studio` route. It requires authentication through Clerk to access.

### Sanity Schema Development

When modifying or adding schemas:

1. Define the schema in the appropriate directory under `/src/sanity/`
2. Register the schema in `sanity.config.ts`
3. Create matching service files for data fetching

### Content Types

The CMS includes the following content types:

- **Events**: Community events and activities
- **News**: Articles and announcements
- **Vacancies**: Job and volunteer opportunities
- **Feedback**: User testimonials and feedback

## Internationalization

The website supports multiple languages with i18next.

### Adding Translations

1. Add translation keys to the appropriate files in `/src/i18n/locales/`:
   - `/be/` for Belarusian translations
   - `/nl/` for Dutch translations

2. Use the translation function in components:
   ```tsx
   import { useTranslation } from 'react-i18next';
   
   const Component = () => {
     const { t } = useTranslation('namespace');
     return <p>{t('key')}</p>;
   };
   ```

## Working with API Routes

API routes are located in `/src/app/api/`. When creating new API routes:

1. Create a new folder with a `route.ts` file
2. Implement the appropriate HTTP methods (GET, POST, etc.)
3. Add error handling and appropriate status codes
4. Use zod for request validation

Example:
```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    
    // Process data...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

## Deployment

### Build for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

### Profiling Builds

To build with Next.js profiling enabled:

```bash
npm run build:profile
```

### Troubleshooting Deployments

- Check the build logs for errors
- Ensure all required environment variables are set
- Verify that API integrations are properly configured

## Git Workflow

1. Create a feature branch from `main`
2. Make changes and commit frequently
3. Push changes and create a pull request
4. Request code review before merging

### Commit Message Guidelines

Write clear, concise commit messages that explain the purpose of your changes:

```
feat: add newsletter subscription component

- Adds form component for newsletter subscriptions
- Integrates with subscription API
- Adds success/error feedback for users
```