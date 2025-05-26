import * as React from 'react';

import { GuideWithoutHTMLContent, Lang } from '@/components/types';
import { GuidesBlockClient } from './guides-block-client';
import { getTranslation } from '../../i18n';

interface GuidesBlockProps {
  guides: GuideWithoutHTMLContent[];
  lang: Lang;
}

export async function GuidesBlock(props: GuidesBlockProps): Promise<React.JSX.Element> {
  const { t } = await getTranslation(props.lang, 'guides');

  const translations = {
    all: t('all'),
    featuredGuides: t('featured_guides'),
    allGuides: t('all_guides'),
    noGuidesFound: t('no_guides_found'),
  };

  return <GuidesBlockClient guides={props.guides} lang={props.lang} translations={translations} />;
}
