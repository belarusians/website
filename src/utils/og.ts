import { Lang } from '../components/types';
import type { AlternateURLs } from 'next/dist/lib/metadata/types/alternative-urls-types';

export function getAlternates(lang: Lang, bePath: string, nlPath: string): AlternateURLs {
  return {
    canonical: lang === Lang.be ? bePath : nlPath,
    languages: {
      'x-default': bePath,
      [Lang.be]: bePath,
      [Lang.nl]: nlPath,
    },
  };
}
