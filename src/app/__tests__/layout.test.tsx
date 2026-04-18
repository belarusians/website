import { describe, expect, test } from '@jest/globals';
import type { ReactElement } from 'react';
import RootLayout from '../layout';

describe('RootLayout', () => {
  test('emits <html lang="be">', () => {
    const element = RootLayout({ children: null }) as ReactElement<{ lang?: string }>;
    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('be');
  });
});
