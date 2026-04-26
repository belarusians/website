import { describe, expect, jest, test, beforeEach } from '@jest/globals';

process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'test';
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'test';

jest.mock('../../sanity/news/service', () => ({
  getAllNewsSlugs: jest.fn(),
}));
jest.mock('../../sanity/event/service', () => ({
  getAllEventsSlugs: jest.fn(),
}));
jest.mock('../../sanity/vacancy/service', () => ({
  getAllVacancies: jest.fn(),
}));
jest.mock('../../sanity/guide/service', () => ({
  getAllGuidesSlugs: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sitemapModule = require('../sitemap') as typeof import('../sitemap');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const newsService = require('../../sanity/news/service') as typeof import('../../sanity/news/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const eventService = require('../../sanity/event/service') as typeof import('../../sanity/event/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const vacancyService = require('../../sanity/vacancy/service') as typeof import('../../sanity/vacancy/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const guideService = require('../../sanity/guide/service') as typeof import('../../sanity/guide/service');

const sitemap = sitemapModule.default;
const { BUILD_TIME, generateTranslatedUrls, generateDynamicTranslatedUrls } = sitemapModule;

const mockGetAllNewsSlugs = newsService.getAllNewsSlugs as jest.MockedFunction<typeof newsService.getAllNewsSlugs>;
const mockGetAllEventsSlugs = eventService.getAllEventsSlugs as jest.MockedFunction<
  typeof eventService.getAllEventsSlugs
>;
const mockGetAllVacancies = vacancyService.getAllVacancies as jest.MockedFunction<
  typeof vacancyService.getAllVacancies
>;
const mockGetAllGuidesSlugs = guideService.getAllGuidesSlugs as jest.MockedFunction<
  typeof guideService.getAllGuidesSlugs
>;

describe('sitemap', () => {
  beforeEach(() => {
    mockGetAllNewsSlugs.mockReset();
    mockGetAllEventsSlugs.mockReset();
    mockGetAllVacancies.mockReset();
    mockGetAllGuidesSlugs.mockReset();
  });

  test('generateTranslatedUrls uses BUILD_TIME for static routes', () => {
    const entries = generateTranslatedUrls('/about-us');
    expect(entries).toHaveLength(2);
    expect(entries[0].lastModified).toBe(BUILD_TIME);
    expect(entries[1].lastModified).toBe(BUILD_TIME);
    expect(entries[0].url).toContain('/be/about-us');
    expect(entries[1].url).toContain('/nl/about-us');
  });

  test('generateDynamicTranslatedUrls parses _updatedAt to Date', () => {
    const entries = generateDynamicTranslatedUrls('/news/foo', '2026-01-15T10:00:00Z');
    expect(entries).toHaveLength(2);
    expect(entries[0].lastModified).toBeInstanceOf(Date);
    expect((entries[0].lastModified as Date).toISOString()).toBe('2026-01-15T10:00:00.000Z');
    expect(entries[1].lastModified).toBeInstanceOf(Date);
    expect((entries[1].lastModified as Date).toISOString()).toBe('2026-01-15T10:00:00.000Z');
  });

  test('generateDynamicTranslatedUrls falls back to BUILD_TIME when updatedAt missing', () => {
    const entries = generateDynamicTranslatedUrls('/news/foo', undefined);
    expect(entries[0].lastModified).toBe(BUILD_TIME);
    expect(entries[1].lastModified).toBe(BUILD_TIME);
  });

  test('dynamic news entry uses _updatedAt for lastModified', async () => {
    mockGetAllNewsSlugs.mockResolvedValueOnce([{ slug: 'hello-world', _updatedAt: '2026-02-10T08:00:00Z' }]);
    mockGetAllEventsSlugs.mockResolvedValueOnce([]);
    mockGetAllVacancies.mockResolvedValueOnce([]);
    mockGetAllGuidesSlugs.mockResolvedValueOnce([]);

    const result = await sitemap();

    const beNewsEntry = result.find((entry) => entry.url.includes('/be/news/hello-world'));
    const nlNewsEntry = result.find((entry) => entry.url.includes('/nl/news/hello-world'));
    expect(beNewsEntry).toBeDefined();
    expect(nlNewsEntry).toBeDefined();
    expect((beNewsEntry!.lastModified as Date).toISOString()).toBe('2026-02-10T08:00:00.000Z');
    expect((nlNewsEntry!.lastModified as Date).toISOString()).toBe('2026-02-10T08:00:00.000Z');
  });

  test('static /about-us entry uses BUILD_TIME', async () => {
    mockGetAllNewsSlugs.mockResolvedValueOnce([]);
    mockGetAllEventsSlugs.mockResolvedValueOnce([]);
    mockGetAllVacancies.mockResolvedValueOnce([]);
    mockGetAllGuidesSlugs.mockResolvedValueOnce([]);

    const result = await sitemap();

    const beAboutUs = result.find((entry) => entry.url.endsWith('/be/about-us'));
    expect(beAboutUs).toBeDefined();
    expect(beAboutUs!.lastModified).toBe(BUILD_TIME);
  });

  test('URL count matches static + dynamic per locale', async () => {
    mockGetAllNewsSlugs.mockResolvedValueOnce([
      { slug: 'n1', _updatedAt: '2026-01-01T00:00:00Z' },
      { slug: 'n2', _updatedAt: '2026-01-02T00:00:00Z' },
    ]);
    mockGetAllEventsSlugs.mockResolvedValueOnce([{ slug: 'e1', _updatedAt: '2026-01-03T00:00:00Z' }]);
    mockGetAllVacancies.mockResolvedValueOnce([{ id: 'v1', _updatedAt: '2026-01-04T00:00:00Z' }]);
    mockGetAllGuidesSlugs.mockResolvedValueOnce([{ slug: 'g1', _updatedAt: '2026-01-05T00:00:00Z' }]);

    const result = await sitemap();

    // 10 static paths × 2 locales + (2 news + 1 event + 1 vacancy + 1 guide) × 2 locales
    const expectedStatic = 10 * 2;
    const expectedDynamic = (2 + 1 + 1 + 1) * 2;
    expect(result).toHaveLength(expectedStatic + expectedDynamic);
  });

  test('dynamic vacancy entry uses _updatedAt and falls back when missing', async () => {
    mockGetAllNewsSlugs.mockResolvedValueOnce([]);
    mockGetAllEventsSlugs.mockResolvedValueOnce([]);
    mockGetAllVacancies.mockResolvedValueOnce([
      { id: 'has-date', _updatedAt: '2026-03-01T00:00:00Z' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { id: 'no-date' } as any,
    ]);
    mockGetAllGuidesSlugs.mockResolvedValueOnce([]);

    const result = await sitemap();

    const withDate = result.find((entry) => entry.url.endsWith('/be/vacancies/has-date'));
    const withoutDate = result.find((entry) => entry.url.endsWith('/be/vacancies/no-date'));
    expect((withDate!.lastModified as Date).toISOString()).toBe('2026-03-01T00:00:00.000Z');
    expect(withoutDate!.lastModified).toBe(BUILD_TIME);
  });
});
