import { describe, expect, test } from '@jest/globals';
import type { ReactElement } from 'react';
import { Button } from '../button';

function renderButton(props: Parameters<typeof Button>[0]): ReactElement<{ className?: string; disabled?: boolean }> {
  const outer = Button(props) as ReactElement<{ className?: string }>;
  // Button returns <InnerButton {...props} /> when no link is supplied.
  const innerType = outer.type as (p: Parameters<typeof Button>[0]) => ReactElement<{ className?: string; disabled?: boolean }>;
  return innerType(props);
}

describe('Button hover/active classes', () => {
  test('non-disabled button has lift + shadow escalation classes', () => {
    const rendered = renderButton({ label: 'Click me' });
    const className = rendered.props.className ?? '';
    expect(className).toContain('shadow-lg');
    expect(className).toContain('hover:shadow-2xl');
    expect(className).toContain('hover:-translate-y-0.5');
    expect(className).toContain('active:shadow-md');
    expect(className).toContain('active:translate-y-px');
    expect(className).toContain('transition-all');
    expect(className).toContain('duration-150');
  });

  test('disabled button omits hover/active state classes', () => {
    const rendered = renderButton({ label: 'Disabled', disabled: true });
    const className = rendered.props.className ?? '';
    expect(className).toContain('shadow-lg');
    expect(className).not.toContain('hover:shadow-2xl');
    expect(className).not.toContain('hover:-translate-y-0.5');
    expect(className).not.toContain('active:shadow-md');
    expect(className).not.toContain('active:translate-y-px');
  });
});
