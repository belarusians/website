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

import MainLayout, { GOOGLE_ADS_TAG_ID } from '../layout';
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

  test('exports a non-empty Google Ads tag id', () => {
    expect(typeof GOOGLE_ADS_TAG_ID).toBe('string');
    expect(GOOGLE_ADS_TAG_ID).toMatch(/^AW-/);
  });

  test('renders the gtag-consent-default Script with denied defaults before gtag.js loads', async () => {
    const element = (await MainLayout({
      children: null,
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    const consentDefault = findElementByProp(element, 'id', 'gtag-consent-default');
    expect(consentDefault).not.toBeNull();
    expect(consentDefault!.props).toMatchObject({ strategy: 'beforeInteractive' });
    const body = String(consentDefault!.props.children ?? '');
    expect(body).toContain("gtag('consent', 'default'");
    expect(body).toContain("ad_storage: 'denied'");
    expect(body).toContain("ad_user_data: 'denied'");
    expect(body).toContain("ad_personalization: 'denied'");
    expect(body).toContain(GOOGLE_ADS_TAG_ID);
  });

  test('loads gtag.js with the configured tag id', async () => {
    const element = (await MainLayout({
      children: null,
      params: Promise.resolve({ lang: 'be' }),
    })) as ReactElement;

    const expectedSrc = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_TAG_ID}`;
    const remote = findElementByProp(element, 'src', expectedSrc);
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
