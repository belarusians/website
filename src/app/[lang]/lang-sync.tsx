'use client';

import { useEffect } from 'react';
import { Lang } from '../../components/types';

export function LangSync({ lang }: { lang: Lang }): null {
  useEffect(() => {
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  return null;
}
