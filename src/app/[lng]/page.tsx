import { SubscriptionForm } from "./subscription-form";
import { FeaturedNewsBlock } from "./featured-block";
import { Lang, LegacyNewsMeta } from "../../components/types";
import { getNewsMeta as legacyGetNewsMeta } from "../../lib/articles";
import { Section } from "../../components/section/section";
import { AchievementsBlock } from "./achievements-block";
import { NewsBlock } from "./news-block";
import { EventsBlock } from "./events-block";
import { CommonPageParams } from "../types";
import { useTranslation } from "../i18n";
import { getFutureEventMetas, EventMeta } from "../../../sanity/lib/event";
import { getNewsMetas, NewsMeta } from "../../../sanity/lib/news";

interface MainPageProps {
  mainNews: NewsMeta;
  secondaryNews: [NewsMeta, NewsMeta];
  otherNews: (LegacyNewsMeta | NewsMeta)[];
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

function hasTwoSecondaryNews(secondaryNews: NewsMeta[]): secondaryNews is [NewsMeta, NewsMeta] {
  return secondaryNews.length === 2;
}

function isMainFeaturedNews(meta: NewsMeta): boolean {
  return meta.featuredMain;
}

function isFeaturedNews(meta: NewsMeta): boolean {
  return meta.featured;
}

async function getData(lang: Lang): Promise<MainPageProps> {
  const eventsMeta = await getFutureEventMetas(lang);

  const legacyNewsMeta = (await legacyGetNewsMeta(lang)).sort((meta1, meta2) =>
    new Date(meta1.date) < new Date(meta2.date) ? 1 : -1,
  );
  const newsMeta: (LegacyNewsMeta | NewsMeta)[] = await getNewsMetas(lang);
  const mainNews = (newsMeta as NewsMeta[]).filter(isMainFeaturedNews);
  if (mainNews.length === 0) {
    mainNews.push(newsMeta[0] as NewsMeta);
  }
  const secondaryNews = (newsMeta as NewsMeta[]).filter(isFeaturedNews).slice(0, 2);
  if (!hasTwoSecondaryNews(secondaryNews)) {
    throw new Error("There should be at least 2 'featured' news");
  }
  // TODO: remove the slice(0, 4). So far we can't render more, because of bad UX
  const otherNews = newsMeta
    .filter((meta) => !isFeaturedNews(meta as NewsMeta) && !isMainFeaturedNews(meta as NewsMeta))
    .concat(legacyNewsMeta)
    .slice(0, 4);

  return {
    mainNews: mainNews[0],
    secondaryNews,
    otherNews,
    events: eventsMeta,
  };
}
