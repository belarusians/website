import * as React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig } from "next-i18next";

import { Layout } from "../components/layout";
import { SubscriptionForm } from "../components/subscription-form/subscription-form";
import { NewsBlock } from "../components/news/block";
import { NewsMetadata } from "../components/types";
import { GetStaticPropsResult } from "next/types";
import { getAllNewsMeta } from "../lib/news";
import { Section } from "../components/section/section";
import { content } from "../components/styles.css";

interface MainPageProps extends SSRConfig {
  news: NewsMetadata[];
}

export default function IndexPage(props: MainPageProps): JSX.Element {
  return (
    <Layout>
      <Section>
        <NewsBlock news={props.news} />
      </Section>

      <Section>
        <SubscriptionForm />
      </Section>
    </Layout>
  );
}

export async function getStaticProps(context: any): Promise<GetStaticPropsResult<MainPageProps>> {
  const newsMeta = await getAllNewsMeta();
  return {
    props: {
      news: newsMeta,
      ...(await serverSideTranslations(context.locale)),
    },
  }
}
