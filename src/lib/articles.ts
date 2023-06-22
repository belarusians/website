import matter, { GrayMatterFile } from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import { LegacyNewsMeta, Lang, LegacyNews } from "../components/types";
import * as fs from "./fs";

function parseArticleMeta(file: GrayMatterFile<string>, slug: string): LegacyNewsMeta {
  const meta: LegacyNewsMeta = {
    slug,
    title: file.data.title,
    date: file.data.date,
    backgroundUrl: file.data.backgroundUrl,
  };

  if (file.data.imageRatio) {
    meta.imageRatio = file.data.imageRatio;
  }

  return meta;
}

export async function getNewsMetaBySlug(slug: string, locale: Lang = Lang.be): Promise<LegacyNewsMeta> {
  const file = await fs.getNewsBySlug(slug, locale);
  const fileWithParsedFM = matter(file);

  return parseArticleMeta(fileWithParsedFM, slug) as LegacyNewsMeta;
}

export async function getNewsMeta(lang = Lang.be): Promise<LegacyNewsMeta[]> {
  const slugs = fs.getNewsSlugs(lang);
  return Promise.all(slugs.map((slug) => getNewsMetaBySlug(slug, lang)));
}

export async function getNewsBySlug(slug: string, locale?: Lang): Promise<LegacyNews> {
  const file = await fs.getNewsBySlug(slug, locale);
  const fileWithParsedFM = matter(file);

  const news: LegacyNews = {
    ...parseArticleMeta(fileWithParsedFM, slug),
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
