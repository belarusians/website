import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import * as React from "react";

import { getNewsBySlug, getNewsSlugs } from "../../lib/news";
import { CommonPageProps, Lang, News } from "../../components/types";
import { Section } from "../../components/section/section";
import { Article } from "../../components/news/article";

interface NewsPageProps extends CommonPageProps {
  news?: News;
}

export default function ArticlePage(props: NewsPageProps): JSX.Element {
  if (!props.news) {
    return <h1>404</h1>;
  }

  return (
    <Section>
      <Article news={props.news} />
    </Section>
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

export function getStaticPaths({ locales }: GetStaticPathsContext): GetStaticPathsResult<{ slug: string }> {
  const paths = getNewsSlugs().reduce<{ params: { slug: string }; locale?: string }[]>((acc, file) => {
    acc.push(
      ...(locales || []).map((locale) => ({
        params: { slug: file },
        locale,
      })),
    );

    return acc;
  }, [] as { params: { slug: string }; locale?: string }[]);
  return {
    paths,
    fallback: false,
  };
}
