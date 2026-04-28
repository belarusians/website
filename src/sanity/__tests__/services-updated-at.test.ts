import { describe, expect, jest, test, beforeEach } from '@jest/globals';

process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'test';
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'test';

const mockNextSanityFetch = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.mock('next-sanity', () => ({
  createClient: () => ({ fetch: (...args: unknown[]) => mockNextSanityFetch(...args) }),
  groq: (strings: TemplateStringsArray, ...values: unknown[]) =>
    strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), ''),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAllEventsSlugs } = require('../event/service') as typeof import('../event/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAllNewsSlugs } = require('../news/service') as typeof import('../news/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAllGuidesSlugs } = require('../guide/service') as typeof import('../guide/service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAllVacancies } = require('../vacancy/service') as typeof import('../vacancy/service');

describe('Sanity service GROQ projections include _updatedAt', () => {
  beforeEach(() => {
    mockNextSanityFetch.mockReset();
  });

  test('getAllEventsSlugs projects _updatedAt and returns it', async () => {
    const stub = [{ slug: 'event-1', _updatedAt: '2026-01-01T00:00:00Z' }];
    mockNextSanityFetch.mockResolvedValueOnce(stub);

    const result = await getAllEventsSlugs();

    expect(mockNextSanityFetch).toHaveBeenCalledTimes(1);
    const query = mockNextSanityFetch.mock.calls[0][0] as string;
    expect(query).toContain('_type == "event"');
    expect(query).toContain('_updatedAt');
    expect(result).toEqual(stub);
    expect(result[0]._updatedAt).toBe('2026-01-01T00:00:00Z');
  });

  test('getAllNewsSlugs projects _updatedAt and returns it', async () => {
    const stub = [{ slug: 'news-1', _updatedAt: '2026-02-02T00:00:00Z' }];
    mockNextSanityFetch.mockResolvedValueOnce(stub);

    const result = await getAllNewsSlugs();

    expect(mockNextSanityFetch).toHaveBeenCalledTimes(1);
    const query = mockNextSanityFetch.mock.calls[0][0] as string;
    expect(query).toContain('_type == "news"');
    expect(query).toContain('_updatedAt');
    expect(result).toEqual(stub);
    expect(result[0]._updatedAt).toBe('2026-02-02T00:00:00Z');
  });

  test('getAllGuidesSlugs projects _updatedAt and returns it', async () => {
    const stub = [{ slug: 'guide-1', _updatedAt: '2026-03-03T00:00:00Z' }];
    mockNextSanityFetch.mockResolvedValueOnce(stub);

    const result = await getAllGuidesSlugs();

    expect(mockNextSanityFetch).toHaveBeenCalledTimes(1);
    const query = mockNextSanityFetch.mock.calls[0][0] as string;
    expect(query).toContain('_type == "guide"');
    expect(query).toContain('_updatedAt');
    expect(result).toEqual(stub);
    expect(result[0]._updatedAt).toBe('2026-03-03T00:00:00Z');
  });

  test('getAllVacancies projects _updatedAt and returns it', async () => {
    const stub = [{ id: 'vacancy-1', _updatedAt: '2026-04-04T00:00:00Z' }];
    mockNextSanityFetch.mockResolvedValueOnce(stub);

    const result = await getAllVacancies();

    expect(mockNextSanityFetch).toHaveBeenCalledTimes(1);
    const query = mockNextSanityFetch.mock.calls[0][0] as string;
    expect(query).toContain('_type == "vacancy"');
    expect(query).toContain('_updatedAt');
    expect(result).toEqual(stub);
    expect(result[0]._updatedAt).toBe('2026-04-04T00:00:00Z');
  });
});
