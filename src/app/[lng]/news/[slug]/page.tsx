import { getNewsSlugs } from "../../../../lib/fs";
import { getNewsBySlug } from "../../../../lib/articles";
import { Lang, News } from "../../../../components/types";
import { Section } from "../../../../components/section/section";
import { NewsArticle } from "../../../../components/articles/news-article";
import { CommonPageParams } from "../../../types";
import { Metadata, ResolvingMetadata } from "next/types";

type NewsPageParams = {
  params: {
    slug: string;
  };
} & CommonPageParams;

export default async function ArticlePage({ params }: NewsPageParams) {
  const news = await getData(params.lng, params.slug);
  return (
    <>
      <Section>
        <NewsArticle news={news} />
      </Section>
    </>
  );
}

export async function getData(lang: Lang, slug: string): Promise<News> {
  return await getNewsBySlug(slug, lang);
}

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NewsPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const news = await getData(params.lng, params.slug);

  return {
    title: news.title,
    description: news.description,
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/news/${params.slug}`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/news/${params.slug}`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/news/${params.slug}`,
        [Lang.ru]: `${parentMetadata.metadataBase}${Lang.ru}/news/${params.slug}`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: news.title,
      description: news.description,
      url: `${params.lng}/news/${params.slug}`,
      images: [news.backgroundUrl],
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: news.title,
      description: news.description,
      images: [news.backgroundUrl],
    },
  };
}
