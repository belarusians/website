import { groq } from 'next-sanity';
import { toHTML } from '@portabletext/to-html';

import { sanityFetch } from '../client';
import { Guide, GuideWithoutHTMLContent, Lang } from '@/components/types';
import { GuideSchema } from '../../../sanity.config';

export async function getAllGuidesSlugs(): Promise<{ slug: string }[]> {
  return sanityFetch('*[_type == "guide"]{ "slug": slug.current }', ['guide']);
}

export async function getAllGuides(lang: Lang): Promise<GuideWithoutHTMLContent[]> {
  const guides = await sanityFetch<GuideWithoutHTMLContent[]>(
    groq`
    *[_type == "guide"] | order(publishedAt desc)
      {
        "slug": slug.current,
        "title": title.${lang},
        "excerpt": excerpt.${lang},
        featured,
        publishedAt
      }`,
    ['guide'],
  );

  return guides;
}

export async function getFeaturedGuides(lang: Lang, limit = 3): Promise<GuideWithoutHTMLContent[]> {
  const guides = await sanityFetch<GuideWithoutHTMLContent[]>(
    groq`
    *[_type == "guide" && featured == true] | order(publishedAt desc)
      {
        "slug": slug.current,
        "title": title.${lang},
        "excerpt": excerpt.${lang},
        featured,
        publishedAt
      }[0...${limit}]`,
    ['guide'],
  );

  return guides;
}

export async function getGuideBySlug(lang: Lang, slug: string): Promise<Guide | undefined> {
  const schema = await sanityFetch<GuideSchema | undefined>(
    `*[_type == "guide" && slug.current == "${slug}"]{
      ...,
      "title": title.${lang},
      "excerpt": excerpt.${lang},
      "content": content.${lang},
    }[0]`,
    ['guide'],
  );

  if (!schema) {
    return undefined;
  }

  return {
    ...schema,
    content: toHTML(schema.content),
  };
}
