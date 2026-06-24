import { describe, expect, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';

import Help from '../page';

function collectLinkHrefs(node: unknown, hrefs: string[] = []): string[] {
  if (node === null || node === undefined || typeof node !== 'object') return hrefs;
  if (Array.isArray(node)) {
    for (const n of node) collectLinkHrefs(n, hrefs);
    return hrefs;
  }
  const element = node as ReactElement<{ href?: string; children?: ReactNode }>;
  if (element.props?.href) {
    hrefs.push(element.props.href);
  }
  if (element.props && 'children' in element.props) {
    collectLinkHrefs(element.props.children, hrefs);
  }
  return hrefs;
}

describe('Help page', () => {
  test('renders links to alien-passport and refugees-bot (be)', async () => {
    const element = (await Help({ params: Promise.resolve({ lang: 'be' }) })) as ReactElement;
    const hrefs = collectLinkHrefs(element);

    expect(hrefs).toEqual(expect.arrayContaining(['/be/alien-passport', 'https://t.me/belarusians_nl_bot']));
  });

  test('renders links to alien-passport and refugees-bot (nl)', async () => {
    const element = (await Help({ params: Promise.resolve({ lang: 'nl' }) })) as ReactElement;
    const hrefs = collectLinkHrefs(element);

    expect(hrefs).toEqual(expect.arrayContaining(['/nl/alien-passport', 'https://t.me/belarusians_nl_bot']));
  });
});
