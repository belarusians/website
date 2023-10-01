"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { supportedLngs } from "../../app/i18n/settings";
import { Lang } from "../types";

function formFlag(locales: string[]): string[] {
  const middle = Math.round(locales.length / 2) - 1;
  const beIndex = locales.indexOf("be");
  if (middle === beIndex) {
    return locales;
  }
  const copy = locales.slice();
  const tmp = locales[middle];
  copy[middle] = copy[beIndex];
  copy[beIndex] = tmp;

  return copy;
}

// TODO: runs to many times for some reason. Needs to be investigated
export function LanguageSelector(props: { lang: Lang; className?: string }) {
  const pathname = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const sortedLocales = formFlag(supportedLngs || []);

  return (
    <div className={props.className}>
      <div className="flex transition-all rounded-md text-white shadow-lg hover:shadow-xl cursor-pointer">
        {sortedLocales.map((l) => (
          <Link
            className={`p-1 md:p-2 lg:p-3 uppercase text-lg first:rounded-l-md last:rounded-r-md ${
              props.lang === l ? "text-white bg-red" : "text-black-tint bg-white"
            }`}
            key={l}
            href={redirectedPathName(l)}
          >
            {l}
          </Link>
        ))}
      </div>
    </div>
  );
}
