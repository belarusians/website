import { describe, expect, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';
import { Logo } from '../logo';

type SvgChild = ReactElement<{ className?: string; children?: ReactNode }> | false | null | undefined;

function findSubtitleGroup(node: unknown): ReactElement<{ className?: string }> | null {
  if (node === null || node === undefined || node === false) return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findSubtitleGroup(child);
      if (found) return found;
    }
    return null;
  }
  if (typeof node !== 'object') return null;
  const element = node as ReactElement<{ className?: string; children?: ReactNode }>;
  if (element.type === 'g' && element.props?.className?.includes('fill-black')) {
    return element as ReactElement<{ className?: string }>;
  }
  if (element.props && 'children' in element.props) {
    return findSubtitleGroup(element.props.children);
  }
  return null;
}

describe('Logo subtitle variants', () => {
  test('renders subtitle group by default', () => {
    const element = Logo({}) as ReactElement<{ children?: SvgChild | SvgChild[] }>;
    const subtitle = findSubtitleGroup(element.props.children);
    expect(subtitle).not.toBeNull();
    expect(subtitle!.props.className).toContain('fill-black');
  });

  test('renders subtitle group when showSubtitle is true', () => {
    const element = Logo({ showSubtitle: true }) as ReactElement<{ children?: SvgChild | SvgChild[] }>;
    const subtitle = findSubtitleGroup(element.props.children);
    expect(subtitle).not.toBeNull();
  });

  test('omits subtitle group when showSubtitle is false', () => {
    const element = Logo({ showSubtitle: false }) as ReactElement<{ children?: SvgChild | SvgChild[] }>;
    const subtitle = findSubtitleGroup(element.props.children);
    expect(subtitle).toBeNull();
  });
});
