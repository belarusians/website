import matter, { GrayMatterFile } from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import { ArticleMeta, ArticleType, Lang, News, NewsMeta } from "../components/types";
import * as fs from "./fs";

function parseArticleMeta(file: GrayMatterFile<string>, slug: string): ArticleMeta {
  const meta: ArticleMeta = {
    slug,
    type: file.data.type as ArticleType,
    title: file.data.title,
    date: file.data.date,
    backgroundUrl: file.data.backgroundUrl,
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

async function markdownToHTML(content: string): Promise<string> {
  const result = await remark().use(html).process(content);

  return result.toString();
}
