import { describe, expect, test } from '@jest/globals';

import beConsent from '../be/consent.json';
import nlConsent from '../nl/consent.json';

type ConsentNamespace = {
  title: string;
  body: string;
  accept: string;
  decline: string;
  privacy: string;
  reopen: string;
  aria: {
    region: string;
  };
};

const REQUIRED_KEYS: ReadonlyArray<keyof Omit<ConsentNamespace, 'aria'>> = [
  'title',
  'body',
  'accept',
  'decline',
  'privacy',
  'reopen',
];

const localeCases: ReadonlyArray<readonly [string, ConsentNamespace]> = [
  ['be', beConsent as ConsentNamespace],
  ['nl', nlConsent as ConsentNamespace],
];

describe.each(localeCases)('consent namespace: %s', (lang, namespace) => {
  test.each(REQUIRED_KEYS)(`${lang}.%s is a non-empty string`, (key) => {
    const value = namespace[key];
    expect(typeof value).toBe('string');
    expect(value.trim().length).toBeGreaterThan(0);
  });

  test(`${lang}.aria.region is a non-empty string`, () => {
    expect(typeof namespace.aria).toBe('object');
    expect(namespace.aria).not.toBeNull();
    expect(typeof namespace.aria.region).toBe('string');
    expect(namespace.aria.region.trim().length).toBeGreaterThan(0);
  });
});

describe('consent namespace parity', () => {
  test('both locales expose the same top-level keys', () => {
    expect(Object.keys(beConsent).sort()).toEqual(Object.keys(nlConsent).sort());
  });

  test('both locales expose the same aria sub-keys', () => {
    expect(Object.keys((beConsent as ConsentNamespace).aria).sort()).toEqual(
      Object.keys((nlConsent as ConsentNamespace).aria).sort(),
    );
  });
});
