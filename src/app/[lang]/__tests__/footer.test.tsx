import { describe, expect, jest, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (): null => null,
}));

import { Footer } from '../footer';

function collectLinkLabels(node: unknown, labels: (string | undefined)[] = []): (string | undefined)[] {
  if (node === null || node === undefined || typeof node !== 'object') return labels;
  if (Array.isArray(node)) {
    for (const n of node) collectLinkLabels(n, labels);
    return labels;
  }
  const element = node as ReactElement<{ children?: ReactNode; ['aria-label']?: string }>;
  if (element.type === 'a') {
    labels.push(element.props['aria-label']);
  }
  if (element.props && 'children' in element.props) {
    collectLinkLabels(element.props.children, labels);
  }
  return labels;
}

describe('Footer', () => {
  test('every social link has an accessible aria-label', () => {
    const element = Footer({}) as ReactElement;
    const labels = collectLinkLabels(element);

    expect(labels.length).toBeGreaterThanOrEqual(6);
    for (const label of labels) {
      expect(label).toBeTruthy();
    }
  });

  test('exposes the expected social network names', () => {
    const element = Footer({}) as ReactElement;
    const labels = collectLinkLabels(element).filter((l): l is string => Boolean(l));

    expect(labels).toEqual(expect.arrayContaining(['Instagram', 'Facebook', 'X (Twitter)', 'LinkedIn', 'Telegram', 'GitHub']));
  });
});
