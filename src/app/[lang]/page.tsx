import { redirect } from 'next/navigation';
import { SubscriptionForm } from './subscription-form';
import { FeaturedNewsBlock } from './featured-block';
import { Feedback, Lang } from '../../components/types';
import { Section } from '../../components/section';
import { AchievementsBlock } from './achievements-block';
import { NewsBlock } from './news-block';
import { EventsBlock } from './events-block';
import { CommonPageParams } from '../types';
import { getTranslation } from '../i18n';
import { getFutureEventMetas, EventMeta } from '../../sanity/event/service';
import {
  getFeaturedNewsMetas,
  getMainFeaturedNewsMeta,
  getNotFeaturedNewsMetas,
  NewsMeta,
} from '../../sanity/news/service';
import { FeedbackBlock } from './feedback-block';
import { getNRandomFeedbacksByLang } from '../../sanity/feedback/service';
import { supportedLngs } from '../i18n/settings';

// Use ISR to balance freshness with performance - revalidate every 5 minutes
export const revalidate = 300;

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
  const { t } = await getTranslation(lang, 'main');
  const { t: eventsT } = await getTranslation(lang, 'events');
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

      {props.events.length ? (
        <Section>
          <EventsBlock
            headingText={t('events-title')}
            lang={lang}
            events={props.events}
            tbaText={eventsT('rescheduled-tba-text')}
          />
        </Section>
      ) : null}

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
