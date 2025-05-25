import { useTranslation } from '../../i18n';
import { CommonPageParams } from '../../types';
import { Section } from '@/components/section';
import H1 from '../../../components/headings/h1';
import { getAllGuides } from '@/sanity/guide/service';
import { Lang } from '@/components/types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { getAlternates } from '@/utils/og';
import { GuidesBlock } from './guides-block';

export default async function GuidesPage({ params }: CommonPageParams) {
  const { lang } = await params;
  const { t } = await useTranslation(lang, 'guides');

  const guides = await getAllGuides(lang);

  return (
    <Section>
      <H1>{t('title')}</H1>
      <GuidesBlock guides={guides} lang={lang} />
    </Section>
  );
}

const titleLang = {
  be: 'Даведнікі MARA',
  nl: 'Gidsen van MARA',
};

const descriptionLang = {
  be: 'Практычныя даведнікі і інструкцыі для беларусаў у Нідэрландах.',
  nl: 'Praktische gidsen en instructies voor Belarussen in Nederland.',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang } = await params;
  const parentMetadata = await parent;

  const images = [];
  if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  const description = descriptionLang[lang];
  const title = titleLang[lang];

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/guides`,
      `${parentMetadata.metadataBase}${Lang.nl}/guides`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${lang}/guides`,
      images,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title,
      description,
      images,
    },
  };
}
