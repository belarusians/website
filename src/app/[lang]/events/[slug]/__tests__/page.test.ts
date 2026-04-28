import { describe, expect, jest, test, beforeEach } from '@jest/globals';

process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'test';
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'test';

jest.mock('../../../../../sanity/event/service', () => ({
  getAllEventsSlugs: jest.fn(),
  getEventBySlug: jest.fn(),
}));
jest.mock('../../../../../sanity/lib/image', () => ({
  urlForImage: jest.fn(() => 'https://example.com/event.png'),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const eventService = require('../../../../../sanity/event/service') as typeof import('../../../../../sanity/event/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pageModule = require('../page') as typeof import('../page');

const mockGetEventBySlug = eventService.getEventBySlug as jest.MockedFunction<typeof eventService.getEventBySlug>;

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

describe('events/[slug] generateMetadata', () => {
  beforeEach(() => {
    mockGetEventBySlug.mockReset();
  });

  test("sets og:type 'article' when event exists", async () => {
    mockGetEventBySlug.mockResolvedValueOnce({
      slug: 'kupalle-2026',
      title: 'Kupalle',
      description: 'Summer celebration',
      location: 'Amsterdam',
      timeframe: { _type: 'timeframe', start: '2026-06-21T18:00:00Z', end: '2026-06-21T23:00:00Z' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backgroundUrl: { _type: 'image', asset: { _ref: 'image-1' } } as any,
      content: '<p>body</p>',
    });

    const metadata = await pageModule.generateMetadata(
      { params: Promise.resolve({ lang: 'be', slug: 'kupalle-2026' }) },
      makeParent(),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const og = metadata.openGraph as any;
    expect(og.type).toBe('article');
    expect(og.title).toBe('Kupalle');
  });

  test('does not override og:type when event is missing', async () => {
    mockGetEventBySlug.mockResolvedValueOnce(undefined);

    const metadata = await pageModule.generateMetadata(
      { params: Promise.resolve({ lang: 'be', slug: 'missing' }) },
      makeParent(),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const og = metadata.openGraph as any;
    expect(og.type).toBe('website');
  });
});
