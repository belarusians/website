import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import * as React from "react";

import { getNewsSlugs } from "../../lib/fs";
import { getNewsBySlug } from "../../lib/articles";
import { CommonPageProps, Lang, News } from "../../components/types";
import { Section } from "../../components/section/section";
import { Head } from "../../components/head/head";
import { NewsArticle } from "../../components/articles/news-article";

interface NewsPageProps extends CommonPageProps {
  news?: News;
}

export default function ArticlePage(props: NewsPageProps): JSX.Element {
  if (!props.news) {
    return <h1>404</h1>;
  }

  return (
    <>
      <Head
        lang={props.lang}
        description={props.news.description || undefined}
        title={props.news.title}
        imagePath={props.news.backgroundUrl}
      />
      <Section>
        <NewsArticle news={props.news} />
      </Section>
    </>
  );
}

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<NewsPageProps>> {
  if (!params) {
    return {
      props: {},
    };
  }
  const newsPost = await getNewsBySlug(params.slug as string, locale as Lang);

  return {
    props: {
      lang: locale as Lang,
      news: newsPost,
      ...(await serverSideTranslations(locale || "be", ["common"])),
    },
  };
}

type StaticPaths = { params: { slug: string }; locale?: string }[];

export function getStaticPaths({ locales }: GetStaticPathsContext): GetStaticPathsResult<{ slug: string }> {
  const paths: StaticPaths = getNewsSlugs().reduce<StaticPaths>((acc, file) => {
    acc.push(
      ...(locales || []).map((locale) => ({
        params: { slug: file },
        locale,
      })),
    );

    return acc;
  }, [] as StaticPaths);
  return {
    paths,
    fallback: false,
  };
}
