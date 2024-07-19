import { groq } from 'next-sanity';
import { toHTML } from '@portabletext/to-html';

import { sanityFetch } from '../client';
import { Lang, News, NewsWithoutHTMLContent } from '../../components/types';

export async function getAllNewsSlugs(): Promise<{ slug: string }[]> {
  return sanityFetch('*[_type == "news"]{ "slug": slug.current }', ['news']);
}

export type NewsMeta = Pick<
  NewsWithoutHTMLContent,
  'slug' | 'title' | 'backgroundUrl' | 'featuredMain' | 'featured' | 'publishingDate'
>;

export async function getNotFeaturedNewsMetas(lang: Lang, top: number): Promise<NewsMeta[]> {
  const metas = await sanityFetch<NewsWithoutHTMLContent[]>(
    groq`
    *[_type == "news" && featuredMain == false && featured == false] | order(publishingDate desc)
      {
        "slug": slug.current,
        "title": title.${lang},
        backgroundUrl,
        featuredMain,
        featured,
        publishingDate
      }[0...${top}]`,
  );

  return metas;
}

export async function getMainFeaturedNewsMeta(lang: Lang): Promise<NewsMeta> {
  const meta = await sanityFetch<NewsWithoutHTMLContent>(
    groq`
    *[_type == "news" && featuredMain == true] | order(publishingDate desc)
    {
        "slug": slug.current,
        "title": title.${lang},
        backgroundUrl,
        featuredMain,
        featured,
        publishingDate
      }[0]`,
  );

  return meta;
}

export async function getFeaturedNewsMetas(lang = Lang.be, top = 2): Promise<NewsMeta[]> {
  const metas = await sanityFetch<NewsWithoutHTMLContent[]>(
    groq`
    *[_type == "news" && featured == true] | order(publishingDate desc)
    {
        "slug": slug.current,
        "title": title.${lang},
        backgroundUrl,
        featuredMain,
        featured,
        publishingDate
      }[0...${top}]`,
  );

  return metas;
}

export async function getNewsBySlug(lang: Lang, slug: string): Promise<News | undefined> {
  const schema = await sanityFetch<NewsWithoutHTMLContent | undefined>(`*[_type == "news" && slug.current == "${slug}"]{
      ...,
      "title": title.${lang},
      "description": description.${lang},
      "content": content.${lang},
    }[0]`,
    ['news']
  );
  if (!schema) {
    return undefined;
  }
  return {
    ...schema,
    content: toHTML(schema.content),
  };
}
