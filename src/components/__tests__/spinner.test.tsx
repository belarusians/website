import { describe, expect, test } from '@jest/globals';
import type { ReactElement } from 'react';
import { Spinner } from '../spinner';

function getSpanClassName(): string {
  const root = Spinner({}) as ReactElement<{ children?: ReactElement<{ className?: string }> }>;
  const span = root.props.children;
  return span?.props.className ?? '';
}

describe('Spinner ring colors', () => {
  test('outer ring uses 35% primary opacity', () => {
    const className = getSpanClassName();
    expect(className).toContain('before:border-l-[color:rgb(237_28_36_/_0.35)]');
  });

  test('middle ring uses 65% primary opacity on top and right borders', () => {
    const className = getSpanClassName();
    expect(className).toContain('border-t-[color:rgb(237_28_36_/_0.65)]');
    expect(className).toContain('border-r-[color:rgb(237_28_36_/_0.65)]');
  });

  test('inner ring uses full primary on bottom and left borders', () => {
    const className = getSpanClassName();
    expect(className).toContain('after:border-b-primary');
    expect(className).toContain('after:border-l-primary');
  });

  test('no ring uses border-*-white', () => {
    const className = getSpanClassName();
    expect(className).not.toContain('border-t-white');
    expect(className).not.toContain('border-r-white');
    expect(className).not.toContain('border-b-white');
    expect(className).not.toContain('border-l-white');
    expect(className).not.toContain('after:border-b-white');
    expect(className).not.toContain('after:border-l-white');
  });
});
