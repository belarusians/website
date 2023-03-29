import matter, { GrayMatterFile } from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import { ArticleMeta, ArticleType, Event, EventMeta, Lang, News, NewsMeta } from "../components/types";
import * as fs from "./fs";

function parseArticleMeta(file: GrayMatterFile<string>, slug: string): ArticleMeta {
  const meta: ArticleMeta = {
    slug,
    type: file.data.type as ArticleType,
    title: file.data.title,
    date: file.data.date,
    backgroundUrl: file.data.backgroundUrl,
    width: file.data.width,
    height: file.data.height,
    tags: file.data.tags,
  };

  if (file.data.imageRatio) {
    meta.imageRatio = file.data.imageRatio;
  }

  return meta;
}

export async function getNewsMetaBySlug(slug: string, locale: Lang = Lang.be): Promise<NewsMeta> {
  const file = await fs.getNewsBySlug(slug, locale);
  const fileWithParsedFM = matter(file);

  return parseArticleMeta(fileWithParsedFM, slug) as NewsMeta;
}

export async function getEventMetaBySlug(slug: string, locale: Lang = Lang.be): Promise<EventMeta> {
  const file = await fs.getEventBySlug(slug, locale);
  const fileWithParsedFM = matter(file);

  const meta = parseArticleMeta(fileWithParsedFM, slug);

  return {
    ...meta,
    type: ArticleType.Event,
    eventDate: fileWithParsedFM.data.eventDate,
    location: fileWithParsedFM.data.location,
    ticketsLink: fileWithParsedFM.data.ticketsLink,
  };
}

export async function getEventsMeta(lang = Lang.be): Promise<EventMeta[]> {
  const slugs = fs.getEventsSlugs(lang);
  return Promise.all(slugs.map((slug) => getEventMetaBySlug(slug, lang)));
}

export async function getNewsMeta(lang = Lang.be): Promise<NewsMeta[]> {
  const slugs = fs.getNewsSlugs(lang);
  return Promise.all(slugs.map((slug) => getNewsMetaBySlug(slug, lang)));
}

export async function getNewsBySlug(slug: string, locale?: Lang): Promise<News> {
  const file = await fs.getNewsBySlug(slug, locale);
  const fileWithParsedFM = matter(file);

  const news: News = {
    ...parseArticleMeta(fileWithParsedFM, slug),
    type: ArticleType.News,
    content: await markdownToHTML(fileWithParsedFM.content),
  };

  if (fileWithParsedFM.data.description) {
    news.description = fileWithParsedFM.data.description;
  }

  return news;
}

export async function getEventBySlug(slug: string, locale?: Lang): Promise<Event> {
  const file = await fs.getEventBySlug(slug, locale);
  const fileWithParsedFM = matter(file);

  const event: Event = {
    ...parseArticleMeta(fileWithParsedFM, slug),
    type: ArticleType.Event,
    eventDate: fileWithParsedFM.data.eventDate,
    location: fileWithParsedFM.data.location,
    ticketsLink: fileWithParsedFM.data.ticketsLink,
    content: await markdownToHTML(fileWithParsedFM.content),
  };

  if (fileWithParsedFM.data.description) {
    event.description = fileWithParsedFM.data.description;
  }

  return event;
}

async function markdownToHTML(content: string): Promise<string> {
  const result = await remark().use(html).process(content);

  return result.toString();
}
