import { describe, expect, jest, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: ReactNode }): ReactNode => children,
}));
jest.mock('../../../components/header/header', () => ({
  Header: (): null => null,
}));
jest.mock('../footer', () => ({
  Footer: (): null => null,
}));
jest.mock('../lang-sync', () => ({
  LangSync: (): null => null,
}));
jest.mock('../../../components/consent/banner', () => ({
  ConsentBanner: (): null => null,
}));

import MainLayout from '../layout';
import { ConsentBanner } from '../../../components/consent/banner';

function containsElementOfType(node: unknown, type: string): boolean {
  if (node === null || node === undefined || typeof node !== 'object') return false;
  if (Array.isArray(node)) return node.some((n) => containsElementOfType(n, type));
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.type === type) return true;
  if (element.props && 'children' in element.props) {
    return containsElementOfType(element.props.children, type);
  }
  return false;
}

describe('MainLayout', () => {
  test('wraps children in <main>', async () => {
    const element = (await MainLayout({
      children: 'test-content',
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    expect(containsElementOfType(element, 'main')).toBe(true);
  });

  test('does not include Header or Footer inside <main>', async () => {
    const element = (await MainLayout({
      children: 'unique-child-marker',
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    const mainElement = findElementOfType(element, 'main');
    expect(mainElement).not.toBeNull();
    expect(mainElement!.props.children).toBe('unique-child-marker');
  });

  test('renders the gtag-consent-default as a raw inline <script> with denied defaults', async () => {
    const element = (await MainLayout({
      children: null,
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    const consentDefault = findElementByProp(element, 'id', 'gtag-consent-default');
    expect(consentDefault).not.toBeNull();
    // Must be a raw <script> (string type), not next/script (which would be a function/object type).
    // beforeInteractive is only honored in the root layout; in nested layouts it silently degrades.
    expect(consentDefault!.type).toBe('script');
    expect(consentDefault!.props).not.toHaveProperty('async');
    expect(consentDefault!.props).not.toHaveProperty('defer');
    const html = (consentDefault!.props as { dangerouslySetInnerHTML?: { __html: string } })
      .dangerouslySetInnerHTML?.__html;
    expect(html).toBeDefined();
    expect(html).toContain("gtag('consent', 'default'");
    expect(html).toContain("ad_storage: 'denied'");
    expect(html).toContain("ad_user_data: 'denied'");
    expect(html).toContain("ad_personalization: 'denied'");
    expect(html).toMatch(/gtag\('config', 'GT-[A-Z0-9]+'\)/);
  });

  test('consent default <script> is positioned before the gtag.js <Script> in the tree', async () => {
    const element = (await MainLayout({
      children: null,
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    const remote = findElementByPropMatch(element, 'src', /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=GT-/);
    expect(remote).not.toBeNull();
    const orderedIds = collectScriptOrder(element, remote!.props.src as string);
    const defaultIdx = orderedIds.indexOf('gtag-consent-default');
    const remoteIdx = orderedIds.indexOf('gtag-remote');
    expect(defaultIdx).toBeGreaterThanOrEqual(0);
    expect(remoteIdx).toBeGreaterThanOrEqual(0);
    expect(defaultIdx).toBeLessThan(remoteIdx);
  });

  test('loads gtag.js with a Google tag id', async () => {
    const element = (await MainLayout({
      children: null,
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    const remote = findElementByPropMatch(element, 'src', /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=GT-/);
    expect(remote).not.toBeNull();
    expect(remote!.props).toMatchObject({ async: true });
  });

  test('preserves the gtag_report_conversion helper', async () => {
    const element = (await MainLayout({
      children: null,
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    const reporter = findElementByProp(element, 'id', 'gtm-conversion-reporter');
    expect(reporter).not.toBeNull();
    const body = String(reporter!.props.children ?? '');
    expect(body).toContain('function gtag_report_conversion');
    expect(body).toContain("'send_to': value");
  });

  test('mounts the ConsentBanner with the resolved lang', async () => {
    const element = (await MainLayout({
      children: null,
      params: Promise.resolve({ lang: 'nl' }),
    })) as ReactElement;

    const banner = findElementOfTypeFn(element, ConsentBanner);
    expect(banner).not.toBeNull();
    expect(banner!.props).toMatchObject({ lang: 'nl' });
  });
});

function findElementOfType(node: unknown, type: string): ReactElement<{ children?: ReactNode }> | null {
  if (node === null || node === undefined || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findElementOfType(n, type);
      if (found) return found;
    }
    return null;
  }
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.type === type) return element;
  if (element.props && 'children' in element.props) {
    return findElementOfType(element.props.children, type);
  }
  return null;
}

function findElementOfTypeFn(node: unknown, type: unknown): ReactElement<Record<string, unknown>> | null {
  if (node === null || node === undefined || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findElementOfTypeFn(n, type);
      if (found) return found;
    }
    return null;
  }
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.type === type) return element as ReactElement<Record<string, unknown>>;
  if (element.props && 'children' in element.props) {
    return findElementOfTypeFn(element.props.children, type);
  }
  return null;
}

function collectScriptOrder(node: unknown, gtagSrc: string, acc: string[] = []): string[] {
  if (node === null || node === undefined || typeof node !== 'object') return acc;
  if (Array.isArray(node)) {
    for (const n of node) collectScriptOrder(n, gtagSrc, acc);
    return acc;
  }
  const element = node as ReactElement<Record<string, unknown> & { children?: ReactNode }>;
  const id = element.props?.['id'] as string | undefined;
  const src = element.props?.['src'] as string | undefined;
  if (id === 'gtag-consent-default') acc.push('gtag-consent-default');
  else if (src === gtagSrc) acc.push('gtag-remote');
  if (element.props && 'children' in element.props) {
    collectScriptOrder(element.props.children, gtagSrc, acc);
  }
  return acc;
}

function findElementByProp(
  node: unknown,
  propName: string,
  propValue: unknown,
): ReactElement<Record<string, unknown>> | null {
  if (node === null || node === undefined || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findElementByProp(n, propName, propValue);
      if (found) return found;
    }
    return null;
  }
  const element = node as ReactElement<Record<string, unknown> & { children?: ReactNode }>;
  if (element.props && element.props[propName] === propValue) {
    return element as ReactElement<Record<string, unknown>>;
  }
  if (element.props && 'children' in element.props) {
    return findElementByProp(element.props.children, propName, propValue);
  }
  return null;
}

function findElementByPropMatch(
  node: unknown,
  propName: string,
  pattern: RegExp,
): ReactElement<Record<string, unknown>> | null {
  if (node === null || node === undefined || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findElementByPropMatch(n, propName, pattern);
      if (found) return found;
    }
    return null;
  }
  const element = node as ReactElement<Record<string, unknown> & { children?: ReactNode }>;
  const value = element.props?.[propName];
  if (typeof value === 'string' && pattern.test(value)) {
    return element as ReactElement<Record<string, unknown>>;
  }
  if (element.props && 'children' in element.props) {
    return findElementByPropMatch(element.props.children, propName, pattern);
  }
  return null;
}
