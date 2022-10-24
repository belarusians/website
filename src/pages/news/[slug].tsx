import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import * as React from "react";

import { Layout } from "../../components/layout";
import { getNewsBySlug, getNewsSlugs } from "../../lib/news";
import { Lang, News } from "../../components/types";
import { Section } from "../../components/section/section";
import { Article } from "../../components/news/article";

interface NewsPageProps {
  news?: News;
}

export default function ArticlePage(props: NewsPageProps): JSX.Element {
  if (!props.news) {
    return (
      <Layout>
        <h1>404</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <Section>
        <Article news={props.news} />
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params, locale }: GetStaticPropsContext): Promise<GetStaticPropsResult<NewsPageProps>> {
  if (!params) {
    return {
      props: {},
    };
  }
  const newsPost = await getNewsBySlug(params.slug as string, locale as Lang);

  return {
    props: {
      news: newsPost,
      ...(await serverSideTranslations(locale || "be")),
    },
  };
}

export function getStaticPaths({ locales }: GetStaticPathsContext): GetStaticPathsResult<{ slug: string }> {
  const paths = getNewsSlugs().reduce<{ params: { slug: string }; locale?: string }[]>((acc, file) => {
    acc.push(
      ...(locales || []).map((locale) => ({
        params: { slug: file },
        locale,
      }))
    );

    return acc;
  }, [] as { params: { slug: string }; locale?: string }[]);
  return {
    paths,
    fallback: false,
  };
}
