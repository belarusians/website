# Architecture Overview

This document provides an overview of the application architecture for the MARA website.

## Technology Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **React**: UI component library
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Statically typed JavaScript

### Content Management
- **Sanity**: Headless CMS for structured content

### Authentication
- **Clerk**: Authentication and user management

### Internationalization
- **i18next**: Translation and localization library
- **Supported Languages**: Belarusian (be), Dutch (nl)

### Payments
- **Stripe**: Payment processing

### Storage
- **AWS S3**: File storage for application assets

### Email
- **Google APIs**: Email service integration

## Application Structure

### Next.js App Router

The application uses Next.js App Router for routing with the following structure:

```
/src/app/
├── (sanity)/studio/          # Sanity Studio admin interface
├── [lang]/                   # Internationalized routes
│   ├── about-us/             # About us page
│   ├── donate/               # Donation page
│   ├── events/               # Events pages
│   │   └── [slug]/           # Individual event page
│   ├── join-us/              # Join us page
│   ├── news/                 # News pages
│   │   └── [slug]/           # Individual news article
│   ├── sign-in/              # Authentication
│   ├── sign-up/              # Registration
│   └── vacancies/            # Vacancies
│       └── [id]/             # Individual vacancy
└── api/                      # API routes
    ├── clickmeeting/         # ClickMeeting integration
    ├── donate/               # Donation handling
    ├── revalidate/           # Cache revalidation
    ├── subscribe/            # Newsletter subscription
    ├── vacancies/            # Vacancy applications
    └── webhooks/             # Webhook handlers
```

### Components

Reusable UI components are located in:

```
/src/components/
├── button.tsx               # Button component
├── card.tsx                 # Card component
├── dropdown.tsx             # Dropdown component
├── globals.css              # Global styles
├── header/                  # Header components
├── headings/                # Heading components
├── menu/                    # Menu components
│   ├── desktop/             # Desktop menu
│   └── mobile/              # Mobile menu
└── section.tsx              # Section component
```

### Sanity Integration

Sanity schema definitions and services:

```
/src/sanity/
├── client.ts                # Sanity client configuration
├── env.ts                   # Environment variables
├── event/                   # Event schema and services
├── feedback/                # Feedback schema and services
├── news/                    # News schema and services
└── vacancy/                 # Vacancy schema and services
```

### Internationalization

Translation files and configuration:

```
/src/i18n/
├── client.ts                # Client-side i18n setup
├── index.ts                 # i18n configuration
├── locales/                 # Translation files
│   ├── be/                  # Belarusian translations
│   └── nl/                  # Dutch translations
└── settings.ts              # i18n settings
```

## Data Flow

1. **Content Creation**: Content is created and managed in Sanity Studio
2. **Data Fetching**: Next.js server components fetch data from Sanity
3. **Rendering**: Server components render the initial HTML
4. **Client Interaction**: Client-side React handles user interactions
5. **API Requests**: API routes handle form submissions and external integrations

## Authentication Flow

Authentication is handled by Clerk with the following flow:

1. User signs in or signs up through the Clerk interface
2. Clerk middleware validates authentication for protected routes
3. Protected routes include the Sanity Studio and admin functions

## Deployment Architecture

The application is deployed as a Node.js application with:

1. **Build Process**: Next.js application is built with `npm run build`
2. **Static Assets**: Static assets are served from the `public` directory
3. **Server Components**: Server components are rendered on-demand
4. **API Routes**: API endpoints handle dynamic functionality
5. **Revalidation**: On-demand revalidation for updated content