import { SubscriptionForm } from "./subscription-form";
import { FeaturedNewsBlock } from "./featured-block";
import { Lang } from "../../components/types";
import { Section } from "../../components/section/section";
import { AchievementsBlock } from "./achievements-block";
import { NewsBlock } from "./news-block";
import { EventsBlock } from "./events-block";
import { CommonPageParams } from "../types";
import { useTranslation } from "../i18n";
import { getFutureEventMetas, EventMeta } from "../../../sanity/lib/event";
import {
  getFeaturedNewsMetas,
  getMainFeaturedNewsMeta,
  getNotFeaturedNewsMetas,
  NewsMeta,
} from "../../../sanity/lib/news";

interface MainPageProps {
  mainNews: NewsMeta;
  secondaryNews: [NewsMeta, NewsMeta];
  otherNews: NewsMeta[];
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

async function getData(lang: Lang): Promise<MainPageProps> {
  const eventsMeta = await getFutureEventMetas(lang);

  // TODO: remove 4. So far we can't render more, because of bad UX
  const otherNews: NewsMeta[] = await getNotFeaturedNewsMetas(lang, 4);
  const mainNews = await getMainFeaturedNewsMeta(lang);
  const secondaryNews = await getFeaturedNewsMetas(lang, 2);
  if (!hasTwoSecondaryNews(secondaryNews)) {
    throw new Error("There should be at least 2 'featured' news");
  }

  return {
    mainNews,
    secondaryNews,
    otherNews,
    events: eventsMeta,
  };
}
