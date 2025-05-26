import { ReactElement } from 'react';
import { Metadata, ResolvingMetadata } from 'next/types';

import { Guide, Lang } from '../../../../components/types';
import { Section } from '../../../../components/section';
import { GuideArticle } from './guide-article';
import { CommonPageParams } from '../../../types';
import { getAllGuidesSlugs, getGuideBySlug, Slug } from '../../../../sanity/guide/service';
import { getAlternates } from '../../../../utils/og';

type GuidePageParams = {
  params: Promise<{
    slug: string;
  }>;
} & CommonPageParams;

export default async function GuidePage({ params }: GuidePageParams): Promise<ReactElement> {
  const { lang, slug } = await params;
  const guide = await getData(lang, slug);
  if (!guide) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Section>
        <GuideArticle guide={guide} lang={lang} />
      </Section>
    </>
  );
}

async function getData(lang: Lang, slug: string): Promise<Guide | undefined> {
  return getGuideBySlug(lang, slug);
}

export async function generateStaticParams(): Promise<Slug[]> {
  return getAllGuidesSlugs();
}

export async function generateMetadata({ params }: GuidePageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const { lang, slug } = await params;
  const guide = await getData(lang, slug);
  const images = [];

  if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  const title = guide?.title;
  const description = guide?.excerpt || guide?.title;

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/guides/${slug}`,
      `${parentMetadata.metadataBase}${Lang.nl}/guides/${slug}`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${lang}/guides/${slug}`,
      images,
      type: 'article',
      publishedTime: guide?.publishedAt,
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
