export const SITE_URL = 'https://www.belarusians.nl/';
export const SITE_NAME = 'MÁRA';
export const SITE_LOGO = 'https://www.belarusians.nl/logo/og-image.png';
export const SITE_EMAIL = 'mara@belarusians.nl';
export const SITE_SAME_AS: ReadonlyArray<string> = [
  'https://facebook.com/marabynl',
  'https://www.instagram.com/marabynl/',
  'https://twitter.com/marabynl',
];

export type JsonLdGraph = {
  '@context': 'https://schema.org';
  '@graph': ReadonlyArray<Record<string, unknown>>;
};

export function buildSiteJsonLd(): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
      {
        '@type': 'NonprofitOrganization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: SITE_LOGO,
        email: SITE_EMAIL,
        sameAs: [...SITE_SAME_AS],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'NL',
        },
      },
    ],
  };
}
