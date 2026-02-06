import { toHTML } from '@portabletext/to-html';

import { sanityFetch } from '../client';
import { Guide, Lang } from '@/components/types';
import { GuideSchema } from '../../../sanity.config';

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
