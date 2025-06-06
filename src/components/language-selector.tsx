'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { supportedLngs } from '../app/i18n/settings';
import { Lang } from './types';

// TODO: runs to many times for some reason. Needs to be investigated
export function LanguageSelector(props: { lang: Lang; className?: string }) {
  const pathname = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className={props.className}>
      <div className="flex transition-all rounded-md text-white shadow-lg hover:shadow-xl cursor-pointer">
        {supportedLngs.map((l) => (
          <Link
            className={`p-1 md:p-2 lg:p-3 uppercase text-lg no-underline first:rounded-l-md last:rounded-r-md ${
              props.lang === l ? 'text-white bg-primary' : 'text-black-tint bg-white'
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
