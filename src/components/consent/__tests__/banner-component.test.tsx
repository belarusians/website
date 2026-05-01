import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { ReactElement, ReactNode } from 'react';

// jest.mock hoisting is unreliable in this project's ts-jest setup, so we use
// jest.doMock + require() inside beforeEach to control mock registration order
// explicitly. This lets us mock React's useState/useEffect (so the function
// component body can be invoked directly) and the i18n client (so getTranslation
// doesn't try to call the real react-i18next useTranslation hook).

type HookCtrl = {
  stateOverrides: Record<number, unknown>;
  setters: Array<jest.Mock>;
  effects: Array<() => void>;
  idx: number;
};

let hookCtrl: HookCtrl;

type ConsentBannerProps = { lang: string; privacyHref?: string };
type ConsentBannerFn = (props: ConsentBannerProps) => ReactElement | null;
type ButtonFn = (props: unknown) => ReactElement;

let ConsentBanner: ConsentBannerFn;
let Button: ButtonFn;
let CONSENT_STORAGE_KEY: string;

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

type WindowOverrides = { localStorage?: Storage; gtag?: jest.Mock };

function setupWindow(overrides: WindowOverrides = {}): { restore: () => void } {
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

type AnyElement = ReactElement<{
  className?: string;
  onClick?: () => void;
  role?: string;
  type?: string;
  href?: string;
  'aria-label'?: string;
  children?: ReactNode;
  [k: string]: unknown;
}>;

type ElementTypeFilter = string | ((...args: never[]) => unknown);

function findAllByType(root: AnyElement, type: ElementTypeFilter): AnyElement[] {
  const out: AnyElement[] = [];
  const visit = (n: ReactNode): void => {
    if (Array.isArray(n)) {
      n.forEach(visit);
      return;
    }
    if (typeof n === 'object' && n !== null && 'props' in (n as object)) {
      out.push(n as AnyElement);
      const nested = ((n as AnyElement).props as { children?: ReactNode }).children;
      if (nested !== undefined) visit(nested);
    }
  };
  visit(root);
  return out.filter((el) => el.type === type);
}

function findByType(root: AnyElement, type: ElementTypeFilter): AnyElement | undefined {
  const all = findAllByType(root, type);
  return all[0];
}

describe('ConsentBanner — direct invocation with mocked hooks', () => {
  let restore: (() => void) | undefined;

  beforeEach(() => {
    jest.resetModules();
    hookCtrl = { stateOverrides: {}, setters: [], effects: [], idx: 0 };

    jest.doMock('react', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const actual = jest.requireActual<typeof import('react')>('react');
      return {
        ...actual,
        useState: <T,>(initial: T): [T, jest.Mock] => {
          const i = hookCtrl.idx++;
          const value = i in hookCtrl.stateOverrides ? (hookCtrl.stateOverrides[i] as T) : initial;
          const setter = jest.fn();
          hookCtrl.setters[i] = setter;
          return [value, setter];
        },
        useEffect: (cb: () => void): void => {
          hookCtrl.effects.push(cb);
          cb();
        },
      };
    });

    jest.doMock('../../../app/i18n/client', () => ({
      getTranslation: (): { t: (k: string) => string; i18n: object } => ({
        t: (k: string): string => k,
        i18n: {},
      }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const bannerMod = require('../banner') as { ConsentBanner: ConsentBannerFn };
    ConsentBanner = bannerMod.ConsentBanner;
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const buttonMod = require('../../button') as { Button: ButtonFn };
    Button = buttonMod.Button;
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const consentMod = require('../../../lib/consent') as { CONSENT_STORAGE_KEY: string };
    CONSENT_STORAGE_KEY = consentMod.CONSENT_STORAGE_KEY;
  });

  afterEach(() => {
    restore?.();
    restore = undefined;
    jest.dontMock('react');
    jest.dontMock('../../../app/i18n/client');
  });

  test('default state (no stored choice, hidden) renders null and useEffect schedules visible', () => {
    ({ restore } = setupWindow());
    const result = ConsentBanner({ lang: 'be' }) as AnyElement | null;
    expect(result).toBeNull();
    // useEffect ran with no stored choice → setState('visible') on the first setter
    expect(hookCtrl.setters[0]).toHaveBeenCalledWith('visible');
    expect(hookCtrl.setters[1]).not.toHaveBeenCalled();
  });

  test('useEffect with stored granted choice re-applies consent via gtag and marks hasStoredChoice', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage(
      new Map([[CONSENT_STORAGE_KEY, JSON.stringify({ choice: 'granted', timestamp: 1 })]]),
    );
    ({ restore } = setupWindow({ localStorage: storage, gtag }));
    ConsentBanner({ lang: 'be' });
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    expect(hookCtrl.setters[1]).toHaveBeenCalledWith(true);
    expect(hookCtrl.setters[0]).not.toHaveBeenCalled();
  });

  test('useEffect with stored denied choice does NOT call gtag but still marks hasStoredChoice', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage(
      new Map([[CONSENT_STORAGE_KEY, JSON.stringify({ choice: 'denied', timestamp: 1 })]]),
    );
    ({ restore } = setupWindow({ localStorage: storage, gtag }));
    ConsentBanner({ lang: 'be' });
    expect(gtag).not.toHaveBeenCalled();
    expect(hookCtrl.setters[1]).toHaveBeenCalledWith(true);
  });

  test('state=visible renders the banner card section', () => {
    hookCtrl.stateOverrides = { 0: 'visible', 1: false };
    ({ restore } = setupWindow());
    const result = ConsentBanner({ lang: 'be' }) as AnyElement;
    expect(result).not.toBeNull();
    expect(result.type).toBe('section');
    expect(result.props.role).toBe('region');
    expect(result.props['aria-label']).toBe('aria.region');
  });

  test('state=visible Accept handler calls recordAccept and hides the banner', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage();
    ({ restore } = setupWindow({ localStorage: storage, gtag }));
    hookCtrl.stateOverrides = { 0: 'visible', 1: false };
    const result = ConsentBanner({ lang: 'be' }) as AnyElement;
    const buttons = findAllByType(result, Button);
    expect(buttons.length).toBe(2);
    const accept = buttons[1];
    (accept.props as { click?: () => void }).click?.();
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string).choice).toBe('granted');
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    expect(hookCtrl.setters[1]).toHaveBeenCalledWith(true);
    expect(hookCtrl.setters[0]).toHaveBeenCalledWith('hidden');
  });

  test('state=visible Decline handler calls recordDecline (downgrades gtag) and hides the banner', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage();
    ({ restore } = setupWindow({ localStorage: storage, gtag }));
    hookCtrl.stateOverrides = { 0: 'visible', 1: false };
    const result = ConsentBanner({ lang: 'be' }) as AnyElement;
    const buttons = findAllByType(result, Button);
    const decline = buttons[0];
    (decline.props as { click?: () => void }).click?.();
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    expect(JSON.parse(raw as string).choice).toBe('denied');
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    expect(hookCtrl.setters[1]).toHaveBeenCalledWith(true);
    expect(hookCtrl.setters[0]).toHaveBeenCalledWith('hidden');
  });

  test('state=hidden with hasStoredChoice=true renders the reopen pill', () => {
    hookCtrl.stateOverrides = { 0: 'hidden', 1: true };
    ({ restore } = setupWindow());
    const result = ConsentBanner({ lang: 'be' }) as AnyElement;
    expect(result.type).toBe('button');
    expect(result.props['aria-label']).toBe('reopen');
  });

  test('reopen pill click sets state back to visible', () => {
    hookCtrl.stateOverrides = { 0: 'hidden', 1: true };
    ({ restore } = setupWindow());
    const result = ConsentBanner({ lang: 'be' }) as AnyElement;
    result.props.onClick?.();
    expect(hookCtrl.setters[0]).toHaveBeenCalledWith('visible');
  });

  test('state=hidden without stored choice renders nothing (transient initial pre-effect snapshot)', () => {
    hookCtrl.stateOverrides = { 0: 'hidden', 1: false };
    ({ restore } = setupWindow());
    const result = ConsentBanner({ lang: 'be' });
    expect(result).toBeNull();
  });

  test('passes through privacyHref to the rendered banner card', () => {
    hookCtrl.stateOverrides = { 0: 'visible', 1: false };
    ({ restore } = setupWindow());
    const result = ConsentBanner({ lang: 'be', privacyHref: '/be/privacy' }) as AnyElement;
    const link = findByType(result, 'a');
    expect(link).toBeDefined();
    expect(link?.props.href).toBe('/be/privacy');
  });
});
