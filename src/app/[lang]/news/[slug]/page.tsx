import { Lang, News } from '../../../../components/types';
import { Section } from '../../../../components/section';
import { NewsArticle } from './news-article';
import { CommonPageParams } from '../../../types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { getAllNewsSlugs, getNewsBySlug } from '../../../../sanity/news/service';
import { urlForImage } from '../../../../sanity/lib/image';
import H3 from '../../../../components/headings/h3';

type NewsPageParams = {
  params: {
    slug: string;
  };
} & CommonPageParams;

export default async function ArticlePage({ params }: NewsPageParams) {
  const news = await getData(params.lang, params.slug);
  if (!news) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Section className="flex flex-col md:flex-row gap-4">
        <NewsArticle className="md:basis-3/5 lg:basis-3/4" news={news} />
        <div className="md:basis-2/5 lg:basis-1/4">
          <H3>Іншыя навіны</H3>
        </div>
      </Section>
    </>
  );
}

async function getData(lang: Lang, slug: string): Promise<News | undefined> {
  return getNewsBySlug(lang, slug);
}

export async function generateStaticParams({ params }: CommonPageParams) {
  return getAllNewsSlugs(params.lang);
}

export async function generateMetadata({ params }: NewsPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const news = await getData(params.lang, params.slug);
  const images = [];
  if (news) {
    images.push(urlForImage(news.backgroundUrl));
  } else if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  return {
    title: news?.title,
    description: news?.description,
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/news/${params.slug}`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/news/${params.slug}`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/news/${params.slug}`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: news?.title,
      description: news?.description,
      url: `${params.lang}/news/${params.slug}`,
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
