import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { CONSENT_STORAGE_KEY, applyConsent, readConsent, writeConsent } from '../consent';

type StoredEntries = Map<string, string>;

function makeLocalStorage(initial?: StoredEntries): Storage {
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

function setupWindow(overrides: Partial<Window> = {}): { storage: Storage; restore: () => void } {
  const storage = makeLocalStorage();
  const original = (globalThis as { window?: Window }).window;
  (globalThis as { window?: unknown }).window = {
    localStorage: storage,
    ...overrides,
  };
  return {
    storage,
    restore: (): void => {
      if (original === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window?: unknown }).window = original;
      }
    },
  };
}

describe('consent helpers — success cases', () => {
  let restore: () => void;

  afterEach(() => {
    restore?.();
  });

  test('readConsent returns the value set by writeConsent', () => {
    ({ restore } = setupWindow());
    writeConsent('granted');
    expect(readConsent()).toBe('granted');
  });

  test('writeConsent stores choice + timestamp under mara_consent', () => {
    let storage: Storage;
    ({ restore, storage } = setupWindow());
    const before = Date.now();
    writeConsent('denied');
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string) as { choice: string; timestamp: number };
    expect(parsed.choice).toBe('denied');
    expect(typeof parsed.timestamp).toBe('number');
    expect(parsed.timestamp).toBeGreaterThanOrEqual(before);
  });

  test('applyConsent calls window.gtag with the three signals mapped to the choice', () => {
    const gtag = jest.fn();
    ({ restore } = setupWindow({ gtag } as unknown as Partial<Window>));
    applyConsent('granted');
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  });

  test('applyConsent passes denied uniformly across signals', () => {
    const gtag = jest.fn();
    ({ restore } = setupWindow({ gtag } as unknown as Partial<Window>));
    applyConsent('denied');
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  });
});

describe('consent helpers — error/edge cases', () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  test('readConsent returns null when no key is stored', () => {
    ({ restore } = setupWindow());
    expect(readConsent()).toBeNull();
  });

  test('readConsent returns null and clears the key when JSON is malformed', () => {
    let storage: Storage;
    ({ restore, storage } = setupWindow());
    storage.setItem(CONSENT_STORAGE_KEY, '{not-json');
    expect(readConsent()).toBeNull();
    expect(storage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  test('readConsent returns null and clears the key when choice value is unknown', () => {
    let storage: Storage;
    ({ restore, storage } = setupWindow());
    storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ choice: 'maybe', timestamp: 1 }));
    expect(readConsent()).toBeNull();
    expect(storage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  test('applyConsent is a no-op when window.gtag is missing', () => {
    ({ restore } = setupWindow());
    expect(() => applyConsent('granted')).not.toThrow();
  });

  test('applyConsent is a no-op when window.gtag is not a function', () => {
    ({ restore } = setupWindow({ gtag: 'not-a-function' as unknown as undefined } as unknown as Partial<Window>));
    expect(() => applyConsent('denied')).not.toThrow();
  });

  describe('SSR safety (window undefined)', () => {
    let originalWindow: unknown;

    beforeEach(() => {
      originalWindow = (globalThis as { window?: unknown }).window;
      delete (globalThis as { window?: unknown }).window;
    });

    afterEach(() => {
      if (originalWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window?: unknown }).window = originalWindow;
      }
    });

    test('readConsent returns null when window is undefined', () => {
      expect(readConsent()).toBeNull();
    });

    test('writeConsent is a no-op when window is undefined', () => {
      expect(() => writeConsent('granted')).not.toThrow();
    });

    test('applyConsent is a no-op when window is undefined', () => {
      expect(() => applyConsent('granted')).not.toThrow();
    });
  });
});
