import { clerkMiddleware, ClerkMiddlewareAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { Lang } from './components/types';
import { supportedLngs } from './app/i18n/settings';
import { NextURL } from 'next/dist/server/web/next-url';

function localeMiddleware(request: NextRequest): void | NextResponse {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/.well-known/') || pathname.startsWith('/api/') || pathname.startsWith('/trpc/')) {
    return;
  }

  const pathnameHasRuLocale = pathname.startsWith('/ru/') || pathname === '/ru';

  if (pathnameHasRuLocale) {
    const url = new NextURL(`/${Lang.be}${pathname.substring(3)}`, request.url);
    return NextResponse.redirect(url);
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = supportedLngs.every(
    (lang) => !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const url = new NextURL(`/${Lang.be}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }
}

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request: NextRequest) => {
  return localeMiddleware(request);
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|studio|favicon.ico|apple-icon.png|icon.png|sitemap.xml|manifest.json|robots.txt|browserconfig.xml|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
