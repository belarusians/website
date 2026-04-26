import { describe, expect, test } from '@jest/globals';
import { buildSiteJsonLd, eventJsonLd, jobPostingJsonLd } from '../jsonld';

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

describe('eventJsonLd', () => {
  const baseInput = {
    title: 'Kupalle 2026',
    description: 'Traditional Belarusian summer celebration.',
    location: 'Amsterdam',
    timeframe: { start: '2026-06-21T18:00:00Z', end: '2026-06-21T23:00:00Z' },
    image: 'https://cdn.sanity.io/event.png',
  };

  test('uses schema.org context and Event type', () => {
    const ld = eventJsonLd(baseInput);
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Event');
  });

  test('includes required fields from input', () => {
    const ld = eventJsonLd(baseInput);
    expect(ld).toMatchObject({
      name: 'Kupalle 2026',
      description: 'Traditional Belarusian summer celebration.',
      startDate: '2026-06-21T18:00:00Z',
      endDate: '2026-06-21T23:00:00Z',
      image: 'https://cdn.sanity.io/event.png',
      location: { '@type': 'Place', name: 'Amsterdam' },
    });
  });

  test('defaults to EventScheduled status', () => {
    const ld = eventJsonLd(baseInput);
    expect(ld.eventStatus).toBe('https://schema.org/EventScheduled');
    expect(ld.previousStartDate).toBeUndefined();
  });

  test('maps cancelled to EventCancelled status', () => {
    const ld = eventJsonLd({ ...baseInput, cancelled: true });
    expect(ld.eventStatus).toBe('https://schema.org/EventCancelled');
    expect(ld.startDate).toBe(baseInput.timeframe.start);
  });

  test('maps rescheduled to EventRescheduled with new dates and previousStartDate', () => {
    const ld = eventJsonLd({
      ...baseInput,
      rescheduled: true,
      rescheduledTimeframe: { start: '2026-07-01T18:00:00Z', end: '2026-07-01T23:00:00Z' },
    });
    expect(ld.eventStatus).toBe('https://schema.org/EventRescheduled');
    expect(ld.startDate).toBe('2026-07-01T18:00:00Z');
    expect(ld.endDate).toBe('2026-07-01T23:00:00Z');
    expect(ld.previousStartDate).toBe('2026-06-21T18:00:00Z');
  });

  test('cancelled takes precedence over rescheduled', () => {
    const ld = eventJsonLd({
      ...baseInput,
      cancelled: true,
      rescheduled: true,
      rescheduledTimeframe: { start: '2026-07-01T18:00:00Z', end: '2026-07-01T23:00:00Z' },
    });
    expect(ld.eventStatus).toBe('https://schema.org/EventCancelled');
    expect(ld.startDate).toBe(baseInput.timeframe.start);
    expect(ld.previousStartDate).toBeUndefined();
  });

  test('includes organizer pointing at MÁRA', () => {
    const ld = eventJsonLd(baseInput);
    expect(ld.organizer).toMatchObject({
      '@type': 'NonprofitOrganization',
      name: 'MÁRA',
      url: 'https://www.belarusians.nl/',
    });
  });

  test('omits image field when not provided', () => {
    const withoutImage = {
      title: baseInput.title,
      description: baseInput.description,
      location: baseInput.location,
      timeframe: baseInput.timeframe,
    };
    const ld = eventJsonLd(withoutImage);
    expect(ld.image).toBeUndefined();
  });

  test('serialises to valid JSON', () => {
    expect(() => JSON.parse(JSON.stringify(eventJsonLd(baseInput)))).not.toThrow();
  });
});

describe('jobPostingJsonLd', () => {
  const baseInput = {
    title: 'Volunteer coordinator',
    description: 'Coordinate the volunteer team.',
    tasks: [
      { title: { be: 'Камунікацыя', nl: 'Communicatie' }, description: { be: 'Адказваць на лісты', nl: 'Mail beantwoorden' } },
      { title: { be: 'Сустрэчы', nl: 'Vergaderingen' }, description: { be: 'Праводзіць сустрэчы', nl: 'Vergaderingen leiden' } },
    ],
    lang: 'nl',
    datePosted: '2026-01-15T10:00:00Z',
    url: 'https://www.belarusians.nl/nl/vacancies/coordinator',
  };

  test('uses schema.org context and JobPosting type', () => {
    const ld = jobPostingJsonLd(baseInput);
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('JobPosting');
  });

  test('includes title, datePosted, and employmentType VOLUNTEER', () => {
    const ld = jobPostingJsonLd(baseInput);
    expect(ld.title).toBe('Volunteer coordinator');
    expect(ld.datePosted).toBe('2026-01-15T10:00:00Z');
    expect(ld.employmentType).toBe('VOLUNTEER');
  });

  test('hiringOrganization is MÁRA NonprofitOrganization with sameAs site URL', () => {
    const ld = jobPostingJsonLd(baseInput);
    expect(ld.hiringOrganization).toEqual({
      '@type': 'NonprofitOrganization',
      name: 'MÁRA',
      sameAs: 'https://www.belarusians.nl/',
    });
  });

  test('jobLocation is a Place with NL PostalAddress', () => {
    const ld = jobPostingJsonLd(baseInput);
    expect(ld.jobLocation).toEqual({
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressCountry: 'NL' },
    });
  });

  test('description concatenates the base description with localized tasks', () => {
    const ld = jobPostingJsonLd(baseInput);
    expect(ld.description).toContain('Coordinate the volunteer team.');
    expect(ld.description).toContain('Communicatie');
    expect(ld.description).toContain('Mail beantwoorden');
    expect(ld.description).toContain('Vergaderingen');
    expect(ld.description).not.toContain('Камунікацыя');
  });

  test('description picks the requested language from each task', () => {
    const ld = jobPostingJsonLd({ ...baseInput, lang: 'be' });
    expect(ld.description).toContain('Камунікацыя');
    expect(ld.description).toContain('Адказваць на лісты');
    expect(ld.description).not.toContain('Communicatie');
  });

  test('description is plain paragraph when there are no tasks', () => {
    const ld = jobPostingJsonLd({ ...baseInput, tasks: [] });
    expect(ld.description).toBe('<p>Coordinate the volunteer team.</p>');
  });

  test('includes optional url when provided', () => {
    const ld = jobPostingJsonLd(baseInput);
    expect(ld.url).toBe('https://www.belarusians.nl/nl/vacancies/coordinator');
  });

  test('omits url when not provided', () => {
    const { url: _ignored, ...withoutUrl } = baseInput;
    void _ignored;
    const ld = jobPostingJsonLd(withoutUrl);
    expect(ld.url).toBeUndefined();
  });

  test('serialises to valid JSON', () => {
    expect(() => JSON.parse(JSON.stringify(jobPostingJsonLd(baseInput)))).not.toThrow();
  });
});
