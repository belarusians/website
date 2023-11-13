import { Lang, News } from "../../../../components/types";
import { Section } from "../../../../components/section/section";
import { NewsArticle } from "./news-article";
import { CommonPageParams } from "../../../types";
import { Metadata, ResolvingMetadata } from "next/types";
import { getAllNewsSlugs, getNewsBySlug } from "../../../../sanity/news/service";

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
      <Section>
        <NewsArticle news={news} />
      </Section>
    </>
  );
}

async function getData(lang: Lang, slug: string): Promise<News | undefined> {
  return await getNewsBySlug(lang, slug);
}

export async function generateStaticParams({ params }: CommonPageParams) {
  return await getAllNewsSlugs(params.lang);
}

export async function generateMetadata({ params }: NewsPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const news = await getData(params.lang, params.slug);

  return {
    title: news?.title,
    description: news?.description,
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
      title: news?.title,
      description: news?.description,
      url: `${params.lang}/news/${params.slug}`,
      images: [news?.backgroundUrl || parentMetadata.openGraph!.images![0]],
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: news?.title,
      description: news?.description,
      images: [news?.backgroundUrl || parentMetadata.twitter!.images![0]],
    },
  };
}