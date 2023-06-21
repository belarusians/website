import { SubscriptionForm } from "./subscription-form";
import { FeaturedNewsBlock } from "./featured-block";
import { Lang, ArticleMeta, NewsTags } from "../../components/types";
import { getNewsMeta } from "../../lib/articles";
import { Section } from "../../components/section/section";
import { AchievementsBlock } from "./achievements-block";
import { NewsBlock } from "./news-block";
import { EventsBlock } from "./events-block";
import { CommonPageParams } from "../types";
import { useTranslation } from "../i18n";
import { getFutureEventMetas, EventMeta } from "../../../sanity/lib/event";

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

function hasTwoSecondaryNews(secondaryNews: ArticleMeta[]): secondaryNews is [ArticleMeta, ArticleMeta] {
  return secondaryNews.length === 2;
}

async function getData(lang: Lang): Promise<MainPageProps> {
  const newsMeta = await getNewsMeta(lang);
  const eventsMeta = await getFutureEventMetas(lang);

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
