import { redirect } from "next/navigation";
import { SubscriptionForm } from "./subscription-form";
import { FeaturedNewsBlock } from "./featured-block";
import { Lang } from "../../components/types";
import { Section } from "../../components/section/section";
import { AchievementsBlock } from "./achievements-block";
import { NewsBlock } from "./news-block";
import { EventsBlock } from "./events-block";
import { CommonPageParams } from "../types";
import { useTranslation } from "../i18n";
import { getFutureEventMetas, EventMeta } from "../../sanity/event/service";
import {
  getFeaturedNewsMetas,
  getMainFeaturedNewsMeta,
  getNotFeaturedNewsMetas,
  NewsMeta,
} from "../../sanity/news/service";
import { FeedbackBlock } from "./feedback-block";
import { getNRandomFeedbacksByLang } from "../../sanity/feedback/service";
import { Feedback } from "../../../sanity.config";
import { supportedLngs } from "../i18n/settings";

interface MainPageProps {
  mainNews: NewsMeta;
  secondaryNews: [NewsMeta, NewsMeta];
  otherNews: NewsMeta[];
  events: EventMeta[];
  feedbacks: Feedback[];
}

export default async function IndexPage({ params: { lang } }: CommonPageParams) {
  if (!supportedLngs.includes(lang)) {
    redirect(`/${Lang.be}`);
  }
  const { t } = await useTranslation(lang, "main");
  const props = await getData(lang);

  return (
    <>
      <Section>
        <FeaturedNewsBlock
          lang={lang}
          main={props.mainNews}
          secondary={props.secondaryNews}
          headingText={t("news-title")}
        />
      </Section>

      <Section>
        <EventsBlock lang={lang} events={props.events} />
      </Section>

      <Section className="bg-beautiful-gradient">
        <AchievementsBlock lang={lang} />
      </Section>

      <Section>
        <NewsBlock headingText={t("other-news-title")} lang={lang} news={props.otherNews} />
      </Section>

      <Section>
        <SubscriptionForm lang={lang} />
      </Section>

      <Section>
        <FeedbackBlock feedbacks={props.feedbacks} headingText={t("feedback-title")} />
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
  const otherNews: NewsMeta[] = await getNotFeaturedNewsMetas(lang, 6);
  const mainNews = await getMainFeaturedNewsMeta(lang);
  const secondaryNews = await getFeaturedNewsMetas(lang, 2);
  if (!hasTwoSecondaryNews(secondaryNews)) {
    throw new Error("There should be at least 2 'featured' news");
  }

  const feedbacks = await getNRandomFeedbacksByLang(lang, 2);

  return {
    mainNews,
    secondaryNews,
    otherNews,
    events: eventsMeta,
    feedbacks,
  };
}