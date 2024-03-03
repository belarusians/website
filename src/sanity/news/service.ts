import { groq } from 'next-sanity';
import { toHTML } from '@portabletext/to-html';

import { NewsSchema } from '../../../sanity.config';
import { client } from '../client';
import { Lang, News } from '../../components/types';

export async function getAllNewsSlugs(lang: Lang): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "news" && language == "${lang}"]{ "slug": slug.current }`);
}

export type NewsMeta = Pick<
  NewsSchema,
  'slug' | 'title' | 'backgroundUrl' | 'featuredMain' | 'featured' | 'publishingDate'
>;

export async function getNotFeaturedNewsMetas(lang: Lang, top: number): Promise<NewsMeta[]> {
  const metas: NewsSchema[] = await client.fetch(
    groq`
    *[_type == "news" && language == "${lang}" && featuredMain == false && featured == false] | order(publishingDate desc)
      {
        "slug": slug.current,
        title,
        backgroundUrl,
        featuredMain,
        featured,
        publishingDate
      }[0...${top}]`,
  );

  return metas;
}

export async function getMainFeaturedNewsMeta(lang: Lang): Promise<NewsMeta> {
  const meta: NewsSchema = await client.fetch(
    groq`
    *[_type == "news" && language == "${lang}" && featuredMain == true] | order(publishingDate desc)
    {
        "slug": slug.current,
        title,
        backgroundUrl,
        featuredMain,
        featured,
        publishingDate
      }[0]`,
  );

  return meta;
}

export async function getFeaturedNewsMetas(lang = Lang.be, top = 2): Promise<NewsMeta[]> {
  const metas: NewsSchema[] = await client.fetch(
    groq`
    *[_type == "news" && language == "${lang}" && featured == true] | order(publishingDate desc)
    {
        "slug": slug.current,
        title,
        backgroundUrl,
        featuredMain,
        featured,
        publishingDate
      }[0...${top}]`,
  );

  return metas;
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
    backgroundUrl: news.backgroundUrl,
    content: toHTML(news.content),
    featuredMain: news.featuredMain,
    featured: news.featured,
    publishingDate: news.publishingDate,
  };
}
