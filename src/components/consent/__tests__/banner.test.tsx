import { afterEach, describe, expect, jest, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';

import {
  ConsentBanner,
  applyStoredConsent,
  decideRenderMode,
  recordAccept,
  recordDecline,
  renderBannerCard,
  renderReopenPill,
} from '../banner';
import { CONSENT_STORAGE_KEY } from '../../../lib/consent';
import { Lang } from '../../types';
import { Button } from '../../button';

type ElementTypeFilter = string | ((...args: never[]) => unknown);

function makeLocalStorage(initial?: Map<string, string>): Storage {
  const store = initial ?? new Map<string, string>();
  return {
    get length(): number {
      return store.size;
    },
    clear: (): void => store.clear(),
    getItem: (key: string): string | null => (store.has(key) ? (store.get(key) as string) : null),
    key: (index: number): string | null => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string): void => {
      store.delete(key);
    },
    setItem: (key: string, value: string): void => {
      store.set(key, String(value));
    },
  };
}

function setupWindow(overrides: Partial<Window> = {}): { restore: () => void } {
  const original = (globalThis as { window?: unknown }).window;
  (globalThis as { window?: unknown }).window = {
    localStorage: overrides.localStorage ?? makeLocalStorage(),
    ...overrides,
  };
  return {
    restore: (): void => {
      if (original === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window?: unknown }).window = original;
      }
    },
  };
}

function passthroughT(key: string): string {
  return key;
}

type AnyElement = ReactElement<{ className?: string; onClick?: () => void; [k: string]: unknown }>;

function isElement(node: ReactNode): node is AnyElement {
  return typeof node === 'object' && node !== null && 'props' in (node as object);
}

function flatten(children: ReactNode): AnyElement[] {
  const out: AnyElement[] = [];
  const visit = (node: ReactNode): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (isElement(node)) {
      out.push(node);
      const nested = (node.props as { children?: ReactNode }).children;
      if (nested !== undefined) {
        visit(nested);
      }
    }
  };
  visit(children);
  return out;
}

function findByType(root: AnyElement, type: ElementTypeFilter): AnyElement | undefined {
  const all = [root, ...flatten((root.props as { children?: ReactNode }).children)];
  return all.find((el) => el.type === type);
}

function findAllByType(root: AnyElement, type: ElementTypeFilter): AnyElement[] {
  const all = [root, ...flatten((root.props as { children?: ReactNode }).children)];
  return all.filter((el) => el.type === type);
}

describe('applyStoredConsent', () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  test('returns null and does not call gtag when no consent is stored', () => {
    const gtag = jest.fn();
    ({ restore } = setupWindow({ gtag } as unknown as Partial<Window>));
    expect(applyStoredConsent()).toBeNull();
    expect(gtag).not.toHaveBeenCalled();
  });

  test('returns "denied" and does not call gtag when stored choice is denied', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage(
      new Map([[CONSENT_STORAGE_KEY, JSON.stringify({ choice: 'denied', timestamp: 1 })]]),
    );
    ({ restore } = setupWindow({ localStorage: storage, gtag } as unknown as Partial<Window>));
    expect(applyStoredConsent()).toBe('denied');
    expect(gtag).not.toHaveBeenCalled();
  });

  test('returns "granted" and re-applies consent when stored choice is granted', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage(
      new Map([[CONSENT_STORAGE_KEY, JSON.stringify({ choice: 'granted', timestamp: 1 })]]),
    );
    ({ restore } = setupWindow({ localStorage: storage, gtag } as unknown as Partial<Window>));
    expect(applyStoredConsent()).toBe('granted');
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  });
});

describe('decideRenderMode', () => {
  test("'visible' state always renders the banner regardless of stored choice", () => {
    expect(decideRenderMode('visible', false)).toBe('banner');
    expect(decideRenderMode('visible', true)).toBe('banner');
  });

  test("'hidden' with a stored choice renders the reopen pill", () => {
    expect(decideRenderMode('hidden', true)).toBe('pill');
  });

  test("'hidden' without a stored choice renders nothing", () => {
    expect(decideRenderMode('hidden', false)).toBe('none');
  });
});

describe('recordAccept / recordDecline', () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  test('recordAccept persists granted and calls gtag with granted on all three signals', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage();
    ({ restore } = setupWindow({ localStorage: storage, gtag } as unknown as Partial<Window>));
    recordAccept();
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string) as { choice: string };
    expect(parsed.choice).toBe('granted');
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  });

  test('recordDecline persists denied and downgrades gtag (covers revoke-after-grant)', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage();
    ({ restore } = setupWindow({ localStorage: storage, gtag } as unknown as Partial<Window>));
    recordDecline();
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string) as { choice: string };
    expect(parsed.choice).toBe('denied');
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  });
});

describe('renderBannerCard — visible state shape', () => {
  test('renders a section with role="region" and aria-label from t("aria.region")', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
    }) as AnyElement;
    expect(tree.type).toBe('section');
    expect(tree.props.role).toBe('region');
    expect(tree.props['aria-label']).toBe('aria.region');
  });

  test('section has fixed-position banner classes (mobile + desktop)', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
    }) as AnyElement;
    const className = tree.props.className ?? '';
    expect(className).toContain('fixed');
    expect(className).toContain('bg-white');
    expect(className).toContain('rounded-md');
    expect(className).toContain('shadow-2xl');
    expect(className).toContain('animate-cc-in');
    expect(className).not.toContain('animate-cc-out');
    // Mobile sheet
    expect(className).toContain('left-3');
    expect(className).toContain('right-3');
    expect(className).toContain('bottom-4');
    expect(className).toContain('pb-[calc(16px+env(safe-area-inset-bottom))]');
    // Desktop card
    expect(className).toContain('md:left-[18px]');
    expect(className).toContain('md:bottom-[18px]');
    expect(className).toContain('md:w-[360px]');
  });

  test('section swaps to animate-cc-out when exiting=true (exit animation)', () => {
    const tree = renderBannerCard(
      passthroughT,
      {
        onAccept: () => undefined,
        onDecline: () => undefined,
      },
      true,
    ) as AnyElement;
    const className = tree.props.className ?? '';
    expect(className).toContain('animate-cc-out');
    expect(className).not.toContain('animate-cc-in');
  });

  test('renders title and body using i18n keys', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
    }) as AnyElement;
    const heading = findByType(tree, 'h3');
    const body = findByType(tree, 'p');
    expect(heading?.props.children).toBe('title');
    expect(body?.props.children).toBe('body');
  });

  test('does NOT render the privacy link when privacyHref is omitted', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
    }) as AnyElement;
    expect(findByType(tree, 'a')).toBeUndefined();
  });

  test('does NOT render the privacy link when privacyHref is empty/whitespace', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
      privacyHref: '   ',
    }) as AnyElement;
    expect(findByType(tree, 'a')).toBeUndefined();
  });

  test('renders the privacy link with the given href when privacyHref is non-empty', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
      privacyHref: '/be/privacy',
    }) as AnyElement;
    const link = findByType(tree, 'a');
    expect(link).toBeDefined();
    expect(link?.props.href).toBe('/be/privacy');
    expect(link?.props.children).toBe('privacy');
  });

  test('renders Decline before Accept (tab order: privacy → decline → accept)', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
    }) as AnyElement;
    const buttons = findAllByType(tree, Button);
    expect(buttons.length).toBe(2);
    expect(buttons[0]?.props.children).toBe('decline');
    expect(buttons[1]?.props.children).toBe('accept');
  });

  test('Decline uses Button with ghost variant + sm size', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
    }) as AnyElement;
    const [decline] = findAllByType(tree, Button);
    expect(decline?.props.variant).toBe('ghost');
    expect(decline?.props.size).toBe('sm');
  });

  test('Accept uses Button with primary variant + sm size', () => {
    const tree = renderBannerCard(passthroughT, {
      onAccept: () => undefined,
      onDecline: () => undefined,
    }) as AnyElement;
    const [, accept] = findAllByType(tree, Button);
    expect(accept?.props.variant).toBe('primary');
    expect(accept?.props.size).toBe('sm');
  });

  test('Accept button click invokes onAccept handler', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();
    const tree = renderBannerCard(passthroughT, { onAccept, onDecline }) as AnyElement;
    const [, accept] = findAllByType(tree, Button);
    (accept?.props as { click?: () => void }).click?.();
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).not.toHaveBeenCalled();
  });

  test('Decline button click invokes onDecline handler', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();
    const tree = renderBannerCard(passthroughT, { onAccept, onDecline }) as AnyElement;
    const [decline] = findAllByType(tree, Button);
    (decline?.props as { click?: () => void }).click?.();
    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onAccept).not.toHaveBeenCalled();
  });
});

describe('renderReopenPill — hidden state with stored choice', () => {
  test('renders a button with aria-label from t("reopen")', () => {
    const tree = renderReopenPill(passthroughT, () => undefined) as AnyElement;
    expect(tree.type).toBe('button');
    expect(tree.props['aria-label']).toBe('reopen');
  });

  test('pill has fixed-position styling and a red dot', () => {
    const tree = renderReopenPill(passthroughT, () => undefined) as AnyElement;
    const cls = tree.props.className ?? '';
    expect(cls).toContain('fixed');
    expect(cls).toContain('rounded-full');
    expect(cls).toContain('bg-white');
    expect(cls).toContain('shadow-lg');
    expect(cls).toContain('left-3');
    expect(cls).toContain('bottom-4');
    expect(cls).toContain('md:left-[18px]');
    expect(cls).toContain('md:bottom-[18px]');
    const dot = findByType(tree, 'span');
    expect(dot).toBeDefined();
    const dotCls = (dot?.props.className as string) ?? '';
    expect(dotCls).toContain('bg-primary');
    expect(dotCls).toContain('rounded-full');
    expect(String(dot?.props['aria-hidden'])).toBe('true');
  });

  test('clicking the pill invokes the onReopen handler', () => {
    const onReopen = jest.fn();
    const tree = renderReopenPill(passthroughT, onReopen) as AnyElement;
    tree.props.onClick?.();
    expect(onReopen).toHaveBeenCalledTimes(1);
  });

  test('pill has cursor-pointer and no entry/exit animation class', () => {
    const tree = renderReopenPill(passthroughT, () => undefined) as AnyElement;
    const cls = tree.props.className ?? '';
    expect(cls).toContain('cursor-pointer');
    expect(cls).not.toContain('animate-cc-in');
    expect(cls).not.toContain('animate-cc-out');
  });
});

describe('ConsentBanner export', () => {
  test('is a function component accepting a single props arg', () => {
    expect(typeof ConsentBanner).toBe('function');
    expect(ConsentBanner.length).toBe(1);
  });

  test('accepts the supported Lang values', () => {
    expect(Lang.be).toBe('be');
    expect(Lang.nl).toBe('nl');
  });
});
