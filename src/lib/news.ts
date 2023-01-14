import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import { EventMetadata, Lang, News, NewsMetadata } from "../components/types";

const newsDirectory = path.join(process.cwd(), "_news");

export function getNewsSlugs(locale?: Lang): string[] {
  let pathToLocale;
  if (locale && fs.existsSync(path.join(newsDirectory, locale))) {
    pathToLocale = path.resolve(newsDirectory, locale);
  } else {
    pathToLocale = path.resolve(newsDirectory, Lang.be);
  }

  const news = fs.readdirSync(pathToLocale);
  return news.map(f => f.substring(0, f.length-3));
}

export async function getAllNewsMeta(locale?: Lang): Promise<NewsMetadata[]> {
  const slugs = getNewsSlugs(locale);

  return Promise.all(slugs.map(slug => getNewsMetaBySlug(slug, locale)));
}

export async function getNewsMetaBySlug(slug: string, locale?: Lang): Promise<(NewsMetadata | EventMetadata) & Pick<News, "content">> {
  let fullPath;
  if (locale && fs.existsSync(path.join(newsDirectory, locale))) {
    fullPath = path.resolve(newsDirectory, locale, `${slug}.md`);
  } else {
    fullPath = path.resolve(newsDirectory, Lang.be, `${slug}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    throw new Error(`News was not found at ${fullPath}`);
  }

  const file = fs.readFileSync(fullPath, "utf8");
  const fileWithParsedFM = matter(file);

  const newsMeta = {
    slug,
    title: fileWithParsedFM.data.title,
    date: fileWithParsedFM.data.date,
    backgroundUrl: fileWithParsedFM.data.backgroundUrl,
    content: fileWithParsedFM.content,
    tags: fileWithParsedFM.data.tags
  };

  if (newsMeta.tags.includes("event")) {
    return {
      ...newsMeta,
      eventDate: fileWithParsedFM.data.eventDate,
      location: fileWithParsedFM.data.location,
    }
  }

  return newsMeta;
}

export async function getNewsBySlug(slug: string, locale?: Lang): Promise<News> {
  const { content, ...meta } = await getNewsMetaBySlug(slug, locale);

  return {
    ...meta,
    content: await markdownToHTML(content),
  };
}

async function markdownToHTML(content: string): Promise<string> {
  const result = await remark().use(html).process(content);

  return result.toString();
}