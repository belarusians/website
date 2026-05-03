'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faCircleInfo,
  faHandshake,
  faHeart,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { getTranslation } from '../../../app/i18n/client';
import { Lang } from '../../types';

export type TabKey = 'home' | 'events' | 'donate' | 'help' | 'about';

type TabDef = {
  key: TabKey;
  segment: string;
  labelKey: string;
  icon: IconDefinition;
  donate?: true;
};

// Order MUST match ui_kits/mobile/Header.jsx → tabs[]
const TABS: TabDef[] = [
  { key: 'home', segment: '', labelKey: 'tab.home', icon: faHouse },
  { key: 'events', segment: 'events', labelKey: 'tab.events', icon: faCalendarDays },
  { key: 'donate', segment: 'donate', labelKey: 'tab.donate', icon: faHeart, donate: true },
  { key: 'help', segment: 'help', labelKey: 'tab.help', icon: faHandshake },
  { key: 'about', segment: 'about-us', labelKey: 'tab.info', icon: faCircleInfo },
];

function matchesSegment(path: string, segment: string): boolean {
  return path === `/${segment}` || path.startsWith(`/${segment}/`);
}

export function activeTab(pathname: string, lang: Lang): TabKey | null {
  const prefix = `/${lang}`;
  const path =
    pathname === prefix || pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
  if (path === '' || path === '/') return 'home';
  if (matchesSegment(path, 'events')) return 'events';
  if (matchesSegment(path, 'donate')) return 'donate';
  if (matchesSegment(path, 'help') || matchesSegment(path, 'alien-passport')) return 'help';
  if (
    matchesSegment(path, 'about-us') ||
    matchesSegment(path, 'vacancies') ||
    matchesSegment(path, 'reports')
  ) {
    return 'about';
  }
  return null;
}

function tabHref(lang: Lang, segment: string): string {
  return segment === '' ? `/${lang}` : `/${lang}/${segment}`;
}

export function TabBar({ lang }: { lang: Lang }) {
  const { t } = getTranslation(lang);
  const pathname = usePathname() ?? `/${lang}`;
  const current = activeTab(pathname, lang);

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 bg-white pt-2 px-1 pb-[34px] md:hidden"
      style={{ boxShadow: '0 -1px 0 #EBEBEB, 0 -10px 20px rgb(0 0 0 / 0.04)' }}
    >
      {TABS.map((tab) => {
        const isActive = current === tab.key;
        const href = tabHref(lang, tab.segment);
        const label = t(tab.labelKey);

        if (tab.donate) {
          return (
            <Link
              key={tab.key}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              data-umami-event="donate-us"
              className="flex flex-col items-center justify-center min-h-[48px] no-underline"
            >
              <span className="bg-rainbow-spin -mt-5 h-10 w-10 rounded-full bg-black-tint text-white flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={tab.icon} className="w-[18px] h-[18px]" />
              </span>
              <span
                className={`text-[10px] leading-none font-medium mt-1 ${isActive ? 'text-primary' : 'text-grey'}`}
              >
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.key}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] no-underline ${
              isActive ? 'text-primary' : 'text-grey'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="w-[22px] h-[22px]" />
            <span className="text-[10px] leading-none font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
