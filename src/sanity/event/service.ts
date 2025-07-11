import { toHTML } from '@portabletext/to-html';

import { Event, Lang } from '../../components/types';
import { sanityFetch } from '../client';
import { EventSchema } from '../../../sanity.config';

export async function getAllEvents(lang: Lang): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event"] | order(timeframe.start desc){ 
      "slug": slug.current,
       timeframe,
       rescheduledTimeframe,
       rescheduled,
       cancelled,
       "title": title.${lang},
        location
     }`,
    ['event'],
  );
}

export async function getAllEventsSlugs(): Promise<{ slug: string }[]> {
  return sanityFetch<{ slug: string }[]>('*[_type == "event"]{ "slug": slug.current }', ['event']);
}

export type EventMeta = Pick<
  Event,
  'slug' | 'rescheduled' | 'cancelled' | 'rescheduledTimeframe' | 'title' | 'location' | 'timeframe'
>;

export async function getFutureEventMetas(lang: Lang): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event" && (timeframe.end >= now() || rescheduled && (rescheduledDate >= now() || true))] | order(timeframe.start asc){
        "slug": slug.current,
        "title": title.${lang},
        timeframe,
        rescheduled,
        cancelled,
        rescheduledTimeframe,
        location
      }`,
    ['event'],
  );
}

export async function getLastNEventMetas(lang: Lang, top: number): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event"] | order(timeframe.start desc){ 
      "slug": slug.current, 
      timeframe,
      rescheduled,
      cancelled,
      rescheduledTimeframe,
      "title": title.${lang}, 
      location 
    }[0...${top}]`,
    ['event'],
  );
}

export async function getEventBySlug(lang: Lang, slug: string): Promise<Event | undefined> {
  const schema = await sanityFetch<EventSchema>(
    `*[_type == "event" && slug.current == "${slug}"]{
      ...,
      "slug": slug.current,
      "title": title.${lang},
      "description": description.${lang},
      "content": content.${lang},
      "ticketsLabel": ticketsLabel.${lang},
      "tipsLabel": tipsLabel.${lang},
      "successText": successText.${lang},
      cancelled,
    }[0]`,
    ['event'],
  );
  if (!schema) {
    return undefined;
  }
  return {
    ...schema,
    content: toHTML(schema.content),
  };
}
