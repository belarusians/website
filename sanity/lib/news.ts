import { groq } from "next-sanity";
import { NewsSchema } from "../../sanity.config";
import { client } from "./client";
import { Lang, Modify, News } from "../../src/components/types";
import { urlForImage } from "./image";
import { toHTML } from "@portabletext/to-html";

export async function getAllNewsSlugs(lang: Lang): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "news" && language == "${lang}"]{ "slug": slug.current }`);
}

export type NewsMeta = Modify<
  Pick<NewsSchema, "slug" | "title" | "backgroundUrl" | "featuredMain" | "featured" | "publishingDate">,
  {
    backgroundUrl: string;
  }
>;

export async function getNewsMetas(lang: Lang): Promise<NewsMeta[]> {
  const metas: NewsSchema[] = await client.fetch(
    groq`
    *[_type == "news" && language == "${lang}"] | order(publishingDate desc)
      {
        "slug": slug.current,
        title,
        backgroundUrl,
        featuredMain,
        featured,
        publishingDate
      }`,
  );
  return metas.map((meta) => ({
    ...meta,
    backgroundUrl: urlForImage(meta.backgroundUrl),
  }));
}

export async function getAllNewsSlugsByLang(lang: Lang): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "news" && language == "${lang}"]{ "slug": slug.current }`);
}

export async function getNewsBySlug(lang: Lang, slug: string): Promise<News | undefined> {
  const schema = await client.fetch(`*[_type == "news" && slug.current == "${slug}" && language == "${lang}"][0]`);
  if (!schema) {
    return undefined;
  }
  return mapSchemaToNews(schema);
}

function mapSchemaToNews(news: NewsSchema): News {
  return {
    title: news.title,
    description: news.description,
    slug: news.slug.current!,
    backgroundUrl: urlForImage(news.backgroundUrl.asset!),
    content: toHTML(news.content),
    imageRatio: news.imageRatio,
    featuredMain: news.featuredMain,
    featured: news.featured,
    publishingDate: news.publishingDate,
  };
}
