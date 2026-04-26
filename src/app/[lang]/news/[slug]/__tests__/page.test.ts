import { describe, expect, jest, test, beforeEach } from '@jest/globals';

process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'test';
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'test';

jest.mock('../../../../../sanity/news/service', () => ({
  getAllNewsSlugs: jest.fn(),
  getNewsBySlug: jest.fn(),
}));
jest.mock('../../../../../sanity/lib/image', () => ({
  urlForImage: jest.fn(() => 'https://example.com/image.png'),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const newsService = require('../../../../../sanity/news/service') as typeof import('../../../../../sanity/news/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pageModule = require('../page') as typeof import('../page');

const mockGetNewsBySlug = newsService.getNewsBySlug as jest.MockedFunction<typeof newsService.getNewsBySlug>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeParent(): any {
  return Promise.resolve({
    metadataBase: new URL('https://www.belarusians.nl/'),
    openGraph: {
      siteName: 'MÁRA',
      type: 'website',
      images: [{ url: 'https://www.belarusians.nl/logo/og-image.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['https://www.belarusians.nl/logo/og-image.png'],
    },
  });
}

describe('news/[slug] generateMetadata', () => {
  beforeEach(() => {
    mockGetNewsBySlug.mockReset();
  });

  test("sets og:type 'article' and publishedTime when news exists", async () => {
    mockGetNewsBySlug.mockResolvedValueOnce({
      slug: 'hello-world',
      title: 'Hello',
      description: 'World',
      publishingDate: '2026-04-01T00:00:00Z',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backgroundUrl: { asset: { _ref: 'image-1' } } as any,
      content: '<p>body</p>',
      featuredMain: false,
      featured: false,
    });

    const metadata = await pageModule.generateMetadata(
      { params: Promise.resolve({ lang: 'be', slug: 'hello-world' }) },
      makeParent(),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const og = metadata.openGraph as any;
    expect(og.type).toBe('article');
    expect(og.publishedTime).toBe('2026-04-01T00:00:00Z');
    expect(og.title).toBe('Hello');
  });

  test('does not override og:type when news is missing', async () => {
    mockGetNewsBySlug.mockResolvedValueOnce(undefined);

    const metadata = await pageModule.generateMetadata(
      { params: Promise.resolve({ lang: 'be', slug: 'missing' }) },
      makeParent(),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const og = metadata.openGraph as any;
    expect(og.type).toBe('website');
    expect(og.publishedTime).toBeUndefined();
  });
});
