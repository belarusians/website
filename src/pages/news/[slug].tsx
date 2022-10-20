import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import * as React from "react";

import { Layout } from "../../components/layout";
import { getNewsBySlug, getNewsSlugs } from "../../lib/news";
import { News } from "../../components/types";
import { newsHeaderImage } from "../../components/news.css";
import { Section } from "../../components/section/section";

interface NewsPageProps {
  news?: News;
}

export default function NewsPage(props: NewsPageProps): JSX.Element {
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
        <div className={newsHeaderImage}>
          <Image layout="fill" src={props.news.backgroundUrl} objectFit="cover" alt={props.news.title} />
        </div>
        <h1>{props.news.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: props.news.content }}></div>
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
  const newsPost = await getNewsBySlug(params.slug as string);

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
