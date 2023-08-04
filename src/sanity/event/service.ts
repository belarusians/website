import { toHTML } from "@portabletext/to-html";

import { Event, Lang } from "../../components/types";
import { client } from "../client";
import { EventSchema } from "../../../sanity.config";
import { urlForImage } from "../lib/image";

export async function getAllEvents(): Promise<EventSchema[]> {
  return client.fetch('*[_type == "event"]');
}

export async function getAllEventsSlugs(lang: Lang): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "event" && language == "${lang}"]{ "slug": slug.current }`);
}

export type EventMeta = Pick<EventSchema, "slug" | "eventDate" | "title" | "location">;

export async function getFutureEventMetas(lang: Lang): Promise<EventMeta[]> {
  return client.fetch(
    `*[_type == "event" && eventDate >= now() && language == "${lang}"] | order(eventDate asc){ "slug": slug.current, eventDate, title, location }`,
  );
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
    title: event.title,
    description: event.description,
    eventDate: event.eventDate,
    slug: event.slug.current!,
    backgroundUrl: urlForImage(event.backgroundUrl.asset!),
    ticketsLink: event.ticketsLink,
    location: event.location,
    content: toHTML(event.content),
    imageRatio: event.imageRatio,
  };
}
