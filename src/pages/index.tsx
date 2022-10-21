import * as React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig } from "next-i18next";
import { GetStaticPropsResult } from "next/types";

import { Layout } from "../components/layout";
import { SubscriptionForm } from "../components/subscription-form/subscription-form";
import { NewsBlock } from "../components/news/block";
import { EventMetadata, NewsMetadata } from "../components/types";
import { getAllNewsMeta } from "../lib/news";
import { Section } from "../components/section/section";
import { EventsBlock } from "../components/events/block";
import { beautifulGradient } from "../components/styles.css";

interface MainPageProps extends SSRConfig {
  news: NewsMetadata[];
  locale: string;
  events?: EventMetadata[];
}

export default function IndexPage(props: MainPageProps): JSX.Element {
  return (
    <Layout>
      <Section>
        <NewsBlock news={props.news} />
      </Section>

      { props.events?.length ?
      <Section className={beautifulGradient}>
        <EventsBlock events={props.events} locale={props.locale} />
      </Section>
        :
        null
      }

      <Section>
        <SubscriptionForm />
      </Section>
    </Layout>
  );
}

export async function getStaticProps(context: any): Promise<GetStaticPropsResult<MainPageProps>> {
  const newsMeta = await getAllNewsMeta();

  const featured = newsMeta.filter(meta => meta.tags.includes('featured'));
  const events = newsMeta.filter(meta => meta.tags.includes('event')) as EventMetadata[];
  return {
    props: {
      news: featured,
      events,
      locale: context.locale,
      ...(await serverSideTranslations(context.locale)),
    },
  }
}
