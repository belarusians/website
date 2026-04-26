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

export type EventJsonLdInput = {
  title: string;
  description: string;
  location: string;
  timeframe: { start: string; end: string };
  rescheduledTimeframe?: { start: string; end: string };
  rescheduled?: boolean;
  cancelled?: boolean;
  image?: string;
};

export type EventJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Event';
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  eventStatus: string;
  location: { '@type': 'Place'; name: string };
  organizer: { '@type': 'NonprofitOrganization'; name: string; url: string };
  image?: string;
  previousStartDate?: string;
};

export function eventJsonLd(input: EventJsonLdInput): EventJsonLd {
  const cancelled = input.cancelled === true;
  const rescheduled = !cancelled && input.rescheduled === true;

  let startDate = input.timeframe.start;
  let endDate = input.timeframe.end;
  let eventStatus = 'https://schema.org/EventScheduled';
  let previousStartDate: string | undefined;

  if (cancelled) {
    eventStatus = 'https://schema.org/EventCancelled';
  } else if (rescheduled) {
    eventStatus = 'https://schema.org/EventRescheduled';
    if (input.rescheduledTimeframe) {
      previousStartDate = input.timeframe.start;
      startDate = input.rescheduledTimeframe.start;
      endDate = input.rescheduledTimeframe.end;
    }
  }

  const ld: EventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.title,
    description: input.description,
    startDate,
    endDate,
    eventStatus,
    location: { '@type': 'Place', name: input.location },
    organizer: { '@type': 'NonprofitOrganization', name: SITE_NAME, url: SITE_URL },
  };

  if (input.image) {
    ld.image = input.image;
  }
  if (previousStartDate) {
    ld.previousStartDate = previousStartDate;
  }

  return ld;
}
