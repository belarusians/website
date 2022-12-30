import * as React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SSRConfig } from "next-i18next";
import { GetStaticPropsResult } from "next/types";

import { Layout } from "../components/layout";
import { SubscriptionForm } from "../components/subscription-form/subscription-form";
import { FeaturedNewsBlock } from "../components/news/featured-block";
import { EventMetadata, NewsMetadata, NewsTags } from "../components/types";
import { getAllNewsMeta } from "../lib/news";
import { Section } from "../components/section/section";
import { beautifulGradient } from "../components/styles.css";
import { AchievementsBlock } from "../components/achievements/achievements";
import { NewsBlock } from "../components/news/block";

interface MainPageProps extends SSRConfig {
  mainNews: NewsMetadata;
  secondaryNews: [NewsMetadata, NewsMetadata];
  otherNews: NewsMetadata[];
  locale: string;
  events?: EventMetadata[];
}

export default function IndexPage(props: MainPageProps): JSX.Element {
  return (
    <Layout>
      <Section>
        <FeaturedNewsBlock main={props.mainNews} secondary={props.secondaryNews} />
      </Section>

      <Section className={beautifulGradient}>
        <AchievementsBlock />
      </Section>

      <Section>
        <NewsBlock news={props.otherNews} />
      </Section>

      <Section>
        <SubscriptionForm />
      </Section>
    </Layout>
  );
}

function hasTwoSecondaryNews(secondaryNews: NewsMetadata[]): secondaryNews is [NewsMetadata, NewsMetadata] {
  return secondaryNews.length === 2;
}

export async function getStaticProps(context: any): Promise<GetStaticPropsResult<MainPageProps>> {
  const newsMeta = await getAllNewsMeta(context.locale);

  const mainNews = newsMeta.find((meta) => meta.tags.includes(NewsTags.Main));
  if (!mainNews) {
    throw new Error("There should be at least 1 'featured-main' news");
  }

  const secondaryNews = newsMeta.filter((meta) => meta.tags.includes(NewsTags.Secondary)).slice(0, 2);
  if (!hasTwoSecondaryNews(secondaryNews)) {
    throw new Error("There should be at least 2 'featured' news");
  }

  // TODO: remove the slice(0, 4). So far we can't render more, because of bad UX
  const otherNews = newsMeta
    .filter((meta) => !meta.tags.includes(NewsTags.Main) && !meta.tags.includes(NewsTags.Secondary))
    .sort((meta1, meta2) => (new Date(meta1.date) < new Date(meta2.date) ? 1 : -1))
    .slice(0, 4);

  const events = newsMeta.filter((meta) => meta.tags.includes(NewsTags.Event)) as EventMetadata[];
  return {
    props: {
      mainNews,
      secondaryNews,
      otherNews,
      events,
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, ["common", "main"])),
    },
  };
}
