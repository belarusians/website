import { Lang, News } from '../../../../components/types';
import { Section } from '../../../../components/section';
import { NewsArticle } from './news-article';
import { CommonPageParams } from '../../../types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { getAllNewsSlugs, getNewsBySlug } from '../../../../sanity/news/service';
import { urlForImage } from '../../../../sanity/lib/image';
import { getAlternates } from '../../../../utils/og';

type NewsPageParams = {
  params: Promise<{
    slug: string;
  }>;
} & CommonPageParams;

export default async function ArticlePage({ params }: NewsPageParams) {
  const { lang, slug } = await params;
  const news = await getData(lang, slug);
  if (!news) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Section>
        <NewsArticle news={news} />
      </Section>
    </>
  );
}

async function getData(lang: Lang, slug: string): Promise<News | undefined> {
  return getNewsBySlug(lang, slug);
}

export async function generateStaticParams() {
  return getAllNewsSlugs();
}

export async function generateMetadata({ params }: NewsPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const { lang, slug } = await params;
  const news = await getData(lang, slug);
  const images = [];
  if (news) {
    images.push(urlForImage(news.backgroundUrl));
  } else if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  return {
    title: news?.title,
    description: news?.description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/news/${slug}`,
      `${parentMetadata.metadataBase}${Lang.nl}/news/${slug}`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: news?.title,
      description: news?.description,
      url: `${lang}/news/${slug}`,
      images,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: news?.title,
      description: news?.description,
      images,
    },
  };
}
