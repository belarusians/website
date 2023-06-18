import { SubscriptionForm } from "../../components/subscription-form/subscription-form";
import { FeaturedNewsBlock } from "../../components/news/featured-block";
import { EventMeta, Lang, ArticleMeta, NewsTags } from "../../components/types";
import { getEventsMeta, getNewsMeta } from "../../lib/articles";
import { Section } from "../../components/section/section";
import { AchievementsBlock } from "../../components/achievements/achievements";
import { NewsBlock } from "../../components/news/block";
import { EventsBlock } from "../../components/events/block";
import { CommonPageParams } from "../types";
import { supportedLngs } from "../i18n/settings";
import { useTranslation } from "../i18n";

interface MainPageProps {
  mainNews: ArticleMeta;
  secondaryNews: [ArticleMeta, ArticleMeta];
  otherNews: ArticleMeta[];
  events: EventMeta[];
}

export default async function IndexPage({ params: { lng } }: CommonPageParams) {
  const { t } = await useTranslation(lng, "main");
  const props = await getData(lng);

  return (
    <>
      <Section>
        <FeaturedNewsBlock
          lang={lng}
          main={props.mainNews}
          secondary={props.secondaryNews}
          headingText={t("news-title")}
        />
      </Section>

      <Section>
        <EventsBlock lang={lng} events={props.events} />
      </Section>

      <Section className="bg-beautiful-gradient">
        <AchievementsBlock lang={lng} />
      </Section>

      <Section>
        <NewsBlock lang={lng} news={props.otherNews} />
      </Section>

      <Section>
        <SubscriptionForm lang={lng} />
      </Section>
    </>
  );
}

export async function generateStaticParams() {
  return supportedLngs.map((lng) => ({ lng }));
}

function hasTwoSecondaryNews(secondaryNews: ArticleMeta[]): secondaryNews is [ArticleMeta, ArticleMeta] {
  return secondaryNews.length === 2;
}

async function getData(lang: Lang): Promise<MainPageProps> {
  const newsMeta = await getNewsMeta(lang);
  const eventsMeta = await getEventsMeta(lang);
  const articles = [...newsMeta, ...eventsMeta];

  const mainNews = articles.find((meta) => meta.tags.includes(NewsTags.Main));
  if (!mainNews) {
    throw new Error("There should be at least 1 'featured-main' news");
  }

  const secondaryNews = articles.filter((meta) => meta.tags.includes(NewsTags.Secondary)).slice(0, 2);
  if (!hasTwoSecondaryNews(secondaryNews)) {
    throw new Error("There should be at least 2 'featured' news");
  }

  // TODO: remove the slice(0, 4). So far we can't render more, because of bad UX
  const otherNews = articles
    .filter((meta) => meta.type === "news")
    .filter((meta) => !meta.tags.includes(NewsTags.Main) && !meta.tags.includes(NewsTags.Secondary))
    .sort((meta1, meta2) => (new Date(meta1.date) < new Date(meta2.date) ? 1 : -1))
    .slice(0, 4);

  return {
    mainNews,
    secondaryNews,
    otherNews,
    events: eventsMeta,
  };
}
