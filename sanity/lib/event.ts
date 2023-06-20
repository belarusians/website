import { Lang } from "../../src/components/types";
import { client } from "./client";
import { EventSchema } from "../../sanity.config";

export async function getAllEvents(): Promise<EventSchema[]> {
  return client.fetch(`*[_type == "event"]`);
}

export async function getAllEventsSlugs(lang: Lang): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "event" && language == "${lang}"]{ "slug": slug.current }`);
}

export async function getFutureEvents(lang: Lang): Promise<EventSchema[]> {
  return client.fetch(`*[_type == "event" && eventDate >= now() && language == "${lang}"]`);
}

export async function getEventsByLang(lang: Lang): Promise<EventSchema[]> {
  return client.fetch(`*[_type == "event" && language == "${lang}"]`);
}

export async function getEventBySlug(lang: Lang, slug: string): Promise<EventSchema | undefined> {
  return client.fetch(`*[_type == "event" && slug.current == "${slug}" && language == "${lang}"][0]`);
}
