import { describe, expect, jest, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';

jest.mock('../logo', () => ({ Logo: (): null => null }));
jest.mock('../../menu/menu', () => ({ Menu: (): null => null }));

import { Header } from '../header';
import { Lang } from '../../types';

function findLink(node: unknown): ReactElement<{ ['aria-label']?: string; href?: string; children?: ReactNode }> | null {
  if (node === null || node === undefined || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findLink(n);
      if (found) return found;
    }
    return null;
  }
  const element = node as ReactElement<{ ['aria-label']?: string; href?: string; children?: ReactNode }>;
  if (element.props && 'href' in element.props && 'aria-label' in element.props) {
    return element;
  }
  if (element.props && 'children' in element.props) {
    return findLink(element.props.children);
  }
  return null;
}

describe('Header logo link', () => {
  test('has Belarusian aria-label when lang is be', async () => {
    const element = (await Header({ className: '', lang: Lang.be })) as ReactElement;
    const link = findLink(element);
    expect(link).not.toBeNull();
    expect(link!.props['aria-label']).toBe('Мара, галоўная старонка');
    expect(link!.props.href).toBe('/be');
  });

  test('has Dutch aria-label when lang is nl', async () => {
    const element = (await Header({ className: '', lang: Lang.nl })) as ReactElement;
    const link = findLink(element);
    expect(link).not.toBeNull();
    expect(link!.props['aria-label']).toBe('MARA, hoofdpagina');
    expect(link!.props.href).toBe('/nl');
  });
});
