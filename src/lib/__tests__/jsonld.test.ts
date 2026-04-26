import { describe, expect, test } from '@jest/globals';
import { buildSiteJsonLd } from '../jsonld';

describe('buildSiteJsonLd', () => {
  const ld = buildSiteJsonLd();

  test('uses schema.org context', () => {
    expect(ld['@context']).toBe('https://schema.org');
  });

  test('returns a graph with WebSite and NonprofitOrganization entries', () => {
    expect(ld['@graph']).toHaveLength(2);
    const types = ld['@graph'].map((entry) => entry['@type']);
    expect(types).toEqual(['WebSite', 'NonprofitOrganization']);
  });

  test('WebSite entry has required fields', () => {
    const website = ld['@graph'].find((entry) => entry['@type'] === 'WebSite');
    expect(website).toMatchObject({
      '@type': 'WebSite',
      name: 'MÁRA',
      url: 'https://www.belarusians.nl/',
    });
  });

  test('NonprofitOrganization entry has name, url, logo, email, sameAs', () => {
    const org = ld['@graph'].find((entry) => entry['@type'] === 'NonprofitOrganization');
    expect(org).toMatchObject({
      '@type': 'NonprofitOrganization',
      name: 'MÁRA',
      url: 'https://www.belarusians.nl/',
      logo: 'https://www.belarusians.nl/logo/og-image.png',
      email: 'mara@belarusians.nl',
    });
    expect(Array.isArray(org?.sameAs)).toBe(true);
    expect(org?.sameAs).toEqual(
      expect.arrayContaining([
        'https://facebook.com/marabynl',
        'https://www.instagram.com/marabynl/',
        'https://twitter.com/marabynl',
      ]),
    );
  });

  test('NonprofitOrganization includes a PostalAddress with NL country', () => {
    const org = ld['@graph'].find((entry) => entry['@type'] === 'NonprofitOrganization');
    expect(org?.address).toMatchObject({
      '@type': 'PostalAddress',
      addressCountry: 'NL',
    });
  });

  test('serialises to valid JSON', () => {
    expect(() => JSON.parse(JSON.stringify(ld))).not.toThrow();
  });
});
