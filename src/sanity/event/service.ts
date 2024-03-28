import { toHTML } from '@portabletext/to-html';

import { Event, EventWithoutHTMLContent, Lang } from '../../components/types';
import { sanityFetch } from '../client';

export async function getAllEvents(lang: Lang): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event"] | order(eventDate desc){ 
      "slug": slug.current,
       eventDate,
       rescheduledDate,
       rescheduled,
       "title": title.${lang},
        location
     }`,
    ['event'],
  );
}

export async function getAllEventsSlugs(): Promise<{ slug: string }[]> {
  return sanityFetch<{ slug: string }[]>('*[_type == "event"]{ "slug": slug.current }', ['event']);
}

export type EventMeta = Pick<Event, 'slug' | 'eventDate' | 'rescheduled' | 'rescheduledDate' | 'title' | 'location'>;

export async function getFutureEventMetas(lang: Lang): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event" && (eventDate >= now() || rescheduled && (rescheduledDate >= now() || true))] | order(eventDate asc){
        "slug": slug.current,
        "title": title.${lang},
        eventDate,
        rescheduled,
        rescheduledDate,
        location
      }`,
    ['event'],
  );
}

export async function getLastNEventMetas(lang: Lang, top: number): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event"] | order(eventDate asc){ "slug": slug.current, eventDate, "title": title.${lang}, location }[0...${top}]`,
    ['event'],
  );
}

export async function getEventBySlug(lang: Lang, slug: string): Promise<Event | undefined> {
  const schema = await sanityFetch<EventWithoutHTMLContent>(
    `*[_type == "event" && slug.current == "${slug}"]{
      ...,
      "slug": slug.current,
      "title": title.${lang},
      "description": description.${lang},
      "content": content.${lang},
      "ticketsLabel": ticketsLabel.${lang},
      "tipsLabel": tipsLabel.${lang},
      "successText": successText.${lang},
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
