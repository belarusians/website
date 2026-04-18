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

import MainLayout from '../layout';

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
