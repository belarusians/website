import { toHTML } from "@portabletext/to-html";

import { ArticleType, Event, EventMeta, Lang } from "../../src/components/types";
import { client } from "./client";
import { EventSchema } from "../../sanity.config";
import { urlForImage } from "./image";

export async function getAllEvents(): Promise<EventSchema[]> {
  return client.fetch(`*[_type == "event"]`);
}

export async function getAllEventsSlugs(lang: Lang): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "event" && language == "${lang}"]{ "slug": slug.current }`);
}

export async function getFutureEvents(lang: Lang): Promise<EventMeta[]> {
  const schema = await client.fetch(
    `*[_type == "event" && eventDate >= now() && language == "${lang}"] | order(eventDate asc)`,
  );
  return mapSchemaToEventMeta(schema);
}

export async function getEventsByLang(lang: Lang): Promise<EventSchema[]> {
  return client.fetch(`*[_type == "event" && language == "${lang}"]`);
}

export async function getEventBySlug(lang: Lang, slug: string): Promise<Event | undefined> {
  const schema = await client.fetch(`*[_type == "event" && slug.current == "${slug}" && language == "${lang}"][0]`);
  if (!schema) {
    return undefined;
  }
  return mapSchemaToEvent(schema);
}

function mapSchemaToEvent(event: EventSchema): Event {
  return {
    type: ArticleType.Event,
    tags: [],
    title: event.title,
    description: event.description,
    eventDate: event.eventDate,
    slug: event.slug.current!,
    backgroundUrl: urlForImage(event.backgroundUrl.asset!),
    ticketsLink: event.ticketsLink,
    date: event._createdAt,
    location: event.location,
    content: toHTML(event.content),
    imageRatio: event.imageRatio,
  };
}

function mapSchemaToEventMeta(events: EventSchema[]): EventMeta[] {
  return events.map((event) => ({
    type: ArticleType.Event,
    tags: [],
    title: event.title,
    description: event.description,
    eventDate: event.eventDate,
    slug: event.slug.current!,
    backgroundUrl: urlForImage(event.backgroundUrl.asset!),
    ticketsLink: event.ticketsLink,
    date: event._createdAt,
    location: event.location,
  }));
}
