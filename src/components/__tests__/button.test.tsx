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
  test('non-disabled button has lift + shadow escalation + cursor-pointer classes', () => {
    const rendered = renderButton({ label: 'Click me' });
    const className = rendered.props.className ?? '';
    expect(className).toContain('shadow-lg');
    expect(className).toContain('hover:shadow-2xl');
    expect(className).toContain('hover:-translate-y-0.5');
    expect(className).toContain('active:shadow-md');
    expect(className).toContain('active:translate-y-px');
    expect(className).toContain('cursor-pointer');
    expect(className).toContain('transition-all');
    expect(className).toContain('duration-150');
  });

  test('disabled button omits hover/active state + cursor-pointer classes', () => {
    const rendered = renderButton({ label: 'Disabled', disabled: true });
    const className = rendered.props.className ?? '';
    expect(className).toContain('shadow-lg');
    expect(className).not.toContain('hover:shadow-2xl');
    expect(className).not.toContain('hover:-translate-y-0.5');
    expect(className).not.toContain('active:shadow-md');
    expect(className).not.toContain('active:translate-y-px');
    expect(className).not.toContain('cursor-pointer');
  });
});

describe('Button size variants', () => {
  test('size="large" applies larger padding + text-lg', () => {
    const rendered = renderButton({ label: 'Big', size: 'large' });
    const className = rendered.props.className ?? '';
    expect(className).toContain('p-2');
    expect(className).toContain('md:p-3');
    expect(className).toContain('lg:p-4');
    expect(className).toContain('text-lg');
  });

  test('size="medium" (default) applies the responsive padding ladder', () => {
    const rendered = renderButton({ label: 'Default' });
    const className = rendered.props.className ?? '';
    expect(className).toContain('p-1');
    expect(className).toContain('md:p-2');
    expect(className).toContain('lg:p-3');
  });

  test('size="sm" applies the consent-banner sizing (px-4 py-2.5 text-sm font-normal)', () => {
    const rendered = renderButton({ label: 'Small', size: 'sm' });
    const className = rendered.props.className ?? '';
    expect(className).toContain('px-4');
    expect(className).toContain('py-2.5');
    expect(className).toContain('text-sm');
    expect(className).toContain('font-normal');
  });
});

describe('Button color variants', () => {
  test('variant="primary" adds bg-primary + text-white + active:bg-primary-shade', () => {
    const rendered = renderButton({ label: 'Accept', variant: 'primary' });
    const className = rendered.props.className ?? '';
    expect(className).toContain('bg-primary');
    expect(className).toContain('text-white');
    expect(className).toContain('active:bg-primary-shade');
  });

  test('variant="ghost" adds bg-white + text-black-tint + active:bg-white-shade', () => {
    const rendered = renderButton({ label: 'Decline', variant: 'ghost' });
    const className = rendered.props.className ?? '';
    expect(className).toContain('bg-white');
    expect(className).toContain('text-black-tint');
    expect(className).toContain('active:bg-white-shade');
  });

  test('no variant leaves color slot empty (preserves legacy className-driven call sites)', () => {
    const rendered = renderButton({ label: 'Legacy' });
    const className = rendered.props.className ?? '';
    expect(className).not.toContain('bg-primary');
    expect(className).not.toContain('bg-white text-black-tint');
    expect(className).not.toContain('active:bg-primary-shade');
    expect(className).not.toContain('active:bg-white-shade');
  });
});

describe('Button type attribute', () => {
  test('defaults to type="button" when not specified (prevents accidental form submission)', () => {
    const rendered = renderButton({ label: 'Default' });
    expect((rendered.props as { type?: string }).type).toBe('button');
  });

  test('passes through explicit type="submit"', () => {
    const rendered = renderButton({ label: 'Submit', type: 'submit' });
    expect((rendered.props as { type?: string }).type).toBe('submit');
  });
});
