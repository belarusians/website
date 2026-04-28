import { afterEach, describe, expect, jest, test } from '@jest/globals';

import { ConsentBanner, applyStoredConsent } from '../banner';
import { CONSENT_STORAGE_KEY } from '../../../lib/consent';
import { Lang } from '../../types';

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

describe('applyStoredConsent', () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  test('does not call gtag when no consent is stored', () => {
    const gtag = jest.fn();
    ({ restore } = setupWindow({ gtag } as unknown as Partial<Window>));
    applyStoredConsent();
    expect(gtag).not.toHaveBeenCalled();
  });

  test('does not call gtag when stored choice is denied', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage(
      new Map([[CONSENT_STORAGE_KEY, JSON.stringify({ choice: 'denied', timestamp: 1 })]]),
    );
    ({ restore } = setupWindow({ localStorage: storage, gtag } as unknown as Partial<Window>));
    applyStoredConsent();
    expect(gtag).not.toHaveBeenCalled();
  });

  test('re-applies granted consent when stored choice is granted', () => {
    const gtag = jest.fn();
    const storage = makeLocalStorage(
      new Map([[CONSENT_STORAGE_KEY, JSON.stringify({ choice: 'granted', timestamp: 1 })]]),
    );
    ({ restore } = setupWindow({ localStorage: storage, gtag } as unknown as Partial<Window>));
    applyStoredConsent();
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  });
});

describe('ConsentBanner (headless stub — Task 3 deferred)', () => {
  test('exports a function component', () => {
    // The component itself can't be rendered in this Node-only Jest setup
    // (no React reconciler), so we only verify the export shape. The mount-time
    // behavior is exercised through applyStoredConsent above.
    expect(typeof ConsentBanner).toBe('function');
    expect(ConsentBanner.length).toBe(1);
  });

  test('uses both supported Lang values', () => {
    expect(Lang.be).toBe('be');
    expect(Lang.nl).toBe('nl');
  });
});
