import { toHTML } from '@portabletext/to-html';

import { sanityFetch } from '../client';
import { Guide, Lang } from '@/components/types';
import { GuideSchema } from '../../../sanity.config';

export type Slug = {
  slug: string;
};

export async function getAllGuidesSlugs(): Promise<Slug[]> {
  return sanityFetch('*[_type == "guide"]{ "slug": slug.current }', ['guide']);
}

export async function getGuideBySlug(lang: Lang, slug: string): Promise<Guide | undefined> {
  const schema = await sanityFetch<GuideSchema | undefined>(
    `*[_type == "guide" && slug.current == $slug]{
      ...,
      "title": title.${lang},
      "excerpt": excerpt.${lang},
      "content": content.${lang},
    }[0]`,
    ['guide'],
    { slug },
  );

  if (!schema) {
    return undefined;
  }

  return {
    ...schema,
    content: toHTML(schema.content),
  };
}
