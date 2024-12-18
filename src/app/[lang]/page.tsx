import { redirect } from 'next/navigation';
import { SubscriptionForm } from './subscription-form';
import { FeaturedNewsBlock } from './featured-block';
import { Feedback, Lang } from '../../components/types';
import { Section } from '../../components/section';
import { AchievementsBlock } from './achievements-block';
import { NewsBlock } from './news-block';
import { EventsBlock } from './events-block';
import { CommonPageParams } from '../types';
import { useTranslation } from '../i18n';
import { getFutureEventMetas, EventMeta, getLastNEventMetas } from '../../sanity/event/service';
import {
  getFeaturedNewsMetas,
  getMainFeaturedNewsMeta,
  getNotFeaturedNewsMetas,
  NewsMeta,
} from '../../sanity/news/service';
import { FeedbackBlock } from './feedback-block';
import { getNRandomFeedbacksByLang } from '../../sanity/feedback/service';
import { supportedLngs } from '../i18n/settings';

interface MainPageProps {
  mainNews: NewsMeta;
  secondaryNews: [NewsMeta, NewsMeta];
  otherNews: NewsMeta[];
  events: EventMeta[];
  feedbacks: Feedback[];
}

export default async function IndexPage({ params }: CommonPageParams) {
  const { lang } = await params;
  if (!supportedLngs.includes(lang)) {
    redirect(`/${Lang.be}`);
  }
  const { t } = await useTranslation(lang, 'main');
  const { t: eventsT } = await useTranslation(lang, 'events');
  const props = await getData(lang);

  return (
    <>
      <Section>
        <FeaturedNewsBlock
          lang={lang}
          main={props.mainNews}
          secondary={props.secondaryNews}
          headingText={t('news-title')}
        />
      </Section>

      <Section>
        <EventsBlock
          headingText={t('events-title')}
          lang={lang}
          events={props.events}
          tbaText={eventsT('rescheduled-tba-text')}
        />
      </Section>

      <Section className="bg-beautiful-gradient py-3 md:py-4 lg:py-6">
        <AchievementsBlock lang={lang} />
      </Section>

      <Section>
        <NewsBlock headingText={t('other-news-title')} lang={lang} news={props.otherNews} />
      </Section>

      <Section>
        <SubscriptionForm lang={lang} />
      </Section>

      <Section>
        <FeedbackBlock feedbacks={props.feedbacks} headingText={t('feedback-title')} />
      </Section>
    </>
  );
}

function hasTwoSecondaryNews(secondaryNews: NewsMeta[]): secondaryNews is [NewsMeta, NewsMeta] {
  return secondaryNews.length === 2;
}

async function getData(lang: Lang): Promise<MainPageProps> {
  const events = await getFutureEventMetas(lang);
  if (events.length === 0) {
    events.push(...(await getLastNEventMetas(lang, 2)));
  }

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
    events,
    feedbacks,
  };
}
