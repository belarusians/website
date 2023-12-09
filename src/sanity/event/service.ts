import { toHTML } from '@portabletext/to-html';

import { Event, Lang } from '../../components/types';
import { sanityFetch } from '../client';
import { EventSchema } from '../../../sanity.config';

export async function getAllEvents(lang: Lang): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event" && language == "${lang}"] | order(eventDate desc){ "slug": slug.current, eventDate, title, location }`,
    ['event'],
  );
}

export async function getAllEventsSlugs(lang: Lang): Promise<{ slug: string }[]> {
  return sanityFetch<{ slug: string }[]>(`*[_type == "event" && language == "${lang}"]{ "slug": slug.current }`, [
    'event',
  ]);
}

export type EventMeta = Pick<Event, 'slug' | 'eventDate' | 'title' | 'location'>;

export async function getFutureEventMetas(lang: Lang): Promise<EventMeta[]> {
  return sanityFetch<EventMeta[]>(
    `*[_type == "event" && eventDate >= now() && language == "${lang}"] | order(eventDate asc){ "slug": slug.current, eventDate, title, location }`,
    ['event'],
  );
}

export async function getEventBySlug(lang: Lang, slug: string): Promise<Event | undefined> {
  const schema = await sanityFetch<EventSchema>(
    `*[_type == "event" && slug.current == "${slug}" && language == "${lang}"][0]`,
    ['event'],
  );
  if (!schema) {
    return undefined;
  }
  return mapSchemaToEvent(schema);
}

function mapSchemaToEvent(event: EventSchema): Event {
  return {
    ...event,
    slug: event.slug.current!,
    content: toHTML(event.content),
  };
}
