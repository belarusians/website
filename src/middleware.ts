import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Lang } from "./components/types";
import { supportedLngs } from "./app/i18n/settings";
import { NextURL } from "next/dist/server/web/next-url";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg")
  ) {
    return;
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

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|icon.png).*)"],
};
