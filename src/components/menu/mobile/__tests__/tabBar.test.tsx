import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';

import { Lang } from '../../../types';

type LinkProps = {
  href?: string;
  className?: string;
  children?: ReactNode;
  ['aria-current']?: string;
  ['data-umami-event']?: string;
};

type AnyElement = ReactElement<LinkProps & { [k: string]: unknown }>;

let pathname = '/be';

type TabBarFn = (props: { lang: Lang }) => ReactElement;
type ActiveTabFn = (pathname: string, lang: Lang) => string | null;

let TabBar: TabBarFn;
let activeTab: ActiveTabFn;

function findAllByType(root: ReactNode, type: unknown): AnyElement[] {
  const out: AnyElement[] = [];
  const visit = (n: ReactNode): void => {
    if (Array.isArray(n)) {
      n.forEach(visit);
      return;
    }
    if (typeof n === 'object' && n !== null && 'props' in (n as object)) {
      const el = n as AnyElement;
      out.push(el);
      const nested = (el.props as { children?: ReactNode }).children;
      if (nested !== undefined) visit(nested);
    }
  };
  visit(root);
  return out.filter((el) => el.type === type);
}

function flattenClassNames(root: ReactNode, into: string[] = []): string[] {
  const visit = (n: ReactNode): void => {
    if (Array.isArray(n)) {
      n.forEach(visit);
      return;
    }
    if (typeof n === 'object' && n !== null && 'props' in (n as object)) {
      const el = n as AnyElement;
      if (typeof el.props.className === 'string') into.push(el.props.className);
      const nested = (el.props as { children?: ReactNode }).children;
      if (nested !== undefined) visit(nested);
    }
  };
  visit(root);
  return into;
}

beforeEach(() => {
  jest.resetModules();
  pathname = '/be';

  jest.doMock('next/navigation', () => ({
    usePathname: (): string => pathname,
  }));

  // Make next/link evaluate to the host element type 'a' so React creates plain
  // <a> nodes during direct invocation (no JSX function-component layer to walk).
  jest.doMock('next/link', () => ({ __esModule: true, default: 'a' }));

  jest.doMock('../../../../app/i18n/client', () => ({
    getTranslation: (): { t: (k: string) => string; i18n: object } => ({
      t: (k: string): string => k,
      i18n: {},
    }),
  }));

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const mod = require('../tabBar') as { TabBar: TabBarFn; activeTab: ActiveTabFn };
  TabBar = mod.TabBar;
  activeTab = mod.activeTab;
});

afterEach(() => {
  jest.dontMock('next/navigation');
  jest.dontMock('next/link');
  jest.dontMock('../../../../app/i18n/client');
});

describe('TabBar — kit-aligned structure', () => {
  test('renders 5 tabs in kit order: home, events, donate, help, about', () => {
    pathname = '/be';
    const result = TabBar({ lang: Lang.be });
    // The mock turns next/link into <a>; collect the top-level link elements only.
    const links = findAllByType(result, 'a').filter((el) => typeof el.props.href === 'string');
    expect(links).toHaveLength(5);

    expect(links[0].props.href).toBe('/be');
    expect(links[1].props.href).toBe('/be/events');
    expect(links[2].props.href).toBe('/be/donate');
    expect(links[3].props.href).toBe('/be/help');
    expect(links[4].props.href).toBe('/be/about-us');
  });

  test('hrefs scoped to nl lang', () => {
    pathname = '/nl';
    const result = TabBar({ lang: Lang.nl });
    const links = findAllByType(result, 'a').filter((el) => typeof el.props.href === 'string');
    expect(links.map((l) => l.props.href)).toEqual([
      '/nl',
      '/nl/events',
      '/nl/donate',
      '/nl/help',
      '/nl/about-us',
    ]);
  });

  test('donate link contains a child element with bg-rainbow-spin', () => {
    pathname = '/be';
    const result = TabBar({ lang: Lang.be });
    const links = findAllByType(result, 'a').filter((el) => typeof el.props.href === 'string');
    const donate = links[2];
    expect(donate.props['data-umami-event']).toBe('donate-us');
    const classNames = flattenClassNames(donate);
    expect(classNames.some((c) => c.includes('bg-rainbow-spin'))).toBe(true);
  });

  test('labels resolve via t("tab.home" | "tab.events" | "tab.donate" | "tab.help" | "tab.info")', () => {
    pathname = '/be';
    const result = TabBar({ lang: Lang.be });
    const links = findAllByType(result, 'a').filter((el) => typeof el.props.href === 'string');
    const collectText = (node: ReactNode, into: string[] = []): string[] => {
      if (typeof node === 'string') {
        into.push(node);
        return into;
      }
      if (Array.isArray(node)) {
        node.forEach((n) => collectText(n, into));
        return into;
      }
      if (typeof node === 'object' && node !== null && 'props' in (node as object)) {
        const nested = ((node as AnyElement).props as { children?: ReactNode }).children;
        if (nested !== undefined) collectText(nested, into);
      }
      return into;
    };
    const labels = links.map((l) => collectText(l).join(''));
    expect(labels[0]).toContain('tab.home');
    expect(labels[1]).toContain('tab.events');
    expect(labels[2]).toContain('tab.donate');
    expect(labels[3]).toContain('tab.help');
    expect(labels[4]).toContain('tab.info');
  });
});

describe('TabBar — aria-current matches active tab', () => {
  const cases: Array<{ path: string; activeIdx: number; key: string }> = [
    { path: '/be', activeIdx: 0, key: 'home' },
    { path: '/be/events', activeIdx: 1, key: 'events' },
    { path: '/be/donate', activeIdx: 2, key: 'donate' },
    { path: '/be/help', activeIdx: 3, key: 'help' },
    { path: '/be/about-us', activeIdx: 4, key: 'about' },
  ];
  for (const c of cases) {
    test(`pathname ${c.path} → ${c.key} tab has aria-current="page"`, () => {
      pathname = c.path;
      const result = TabBar({ lang: Lang.be });
      const links = findAllByType(result, 'a').filter((el) => typeof el.props.href === 'string');
      links.forEach((link, idx) => {
        if (idx === c.activeIdx) {
          expect(link.props['aria-current']).toBe('page');
        } else {
          expect(link.props['aria-current']).toBeUndefined();
        }
      });
    });
  }
});

describe('activeTab helper', () => {
  test('home root', () => {
    expect(activeTab('/be', Lang.be)).toBe('home');
    expect(activeTab('/be/', Lang.be)).toBe('home');
  });
  test('events branch', () => {
    expect(activeTab('/be/events', Lang.be)).toBe('events');
    expect(activeTab('/be/events/some-slug', Lang.be)).toBe('events');
  });
  test('donate branch', () => {
    expect(activeTab('/be/donate', Lang.be)).toBe('donate');
  });
  test('help and alien-passport both map to help tab', () => {
    expect(activeTab('/be/help', Lang.be)).toBe('help');
    expect(activeTab('/be/alien-passport', Lang.be)).toBe('help');
  });
  test('about-us, vacancies, reports all map to about tab', () => {
    expect(activeTab('/be/about-us', Lang.be)).toBe('about');
    expect(activeTab('/be/vacancies', Lang.be)).toBe('about');
    expect(activeTab('/be/reports/2025', Lang.be)).toBe('about');
  });
  test('unknown path returns null', () => {
    expect(activeTab('/be/something-else', Lang.be)).toBeNull();
  });
  test('respects lang prefix', () => {
    expect(activeTab('/nl/events', Lang.nl)).toBe('events');
    expect(activeTab('/nl', Lang.nl)).toBe('home');
  });
});
