import { Metadata, ResolvingMetadata } from 'next/types';

import { Lang, Event } from '../../../../components/types';
import { Section } from '../../../../components/section';
import { EventArticle } from './event-article';
import { CommonPageParams, PageSearchParams } from '../../../types';
import { useTranslation } from '../../../i18n';
import { getAllEventsSlugs, getEventBySlug } from '../../../../sanity/event/service';
import { urlForImage } from '../../../../sanity/lib/image';
import { isEventPassed } from '../../../../sanity/event/utils';
import { getAlternates } from '../../../../utils/og';

type EventPageParams = CommonPageParams & {
  params: {
    slug: string;
  };
};

export default async function EventPage({ params, searchParams }: EventPageParams & PageSearchParams) {
  const paymentSucceeded: boolean = searchParams?.payment_succeeded !== undefined;

  const { t } = await useTranslation(params.lang, 'events');
  const event = await getData(params.slug, params.lang);
  if (!event) {
    return <div>Not found</div>;
  }

  return (
    <Section>
      <EventArticle
        lang={params.lang}
        event={event}
        pastEvent={isEventPassed(event)}
        defaultTicketsLabel={t('buy-ticket')}
        defaultTipsLabel={t('donate')}
        paymentSucceeded={paymentSucceeded}
        defaultPaymentSuccessText={t('success-payment-text')}
        rescheduledEventText={t('rescheduled-event-text')}
      />
    </Section>
  );
}

async function getData(slug: string, lang: Lang): Promise<Event | undefined> {
  // TODO: find more clean solution
  const decodedSlug = decodeURIComponent(slug);
  return getEventBySlug(lang, decodedSlug);
}

export async function generateMetadata({ params }: EventPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const event = await getData(params.slug, params.lang);
  const images = [];
  if (event) {
    images.push(urlForImage(event.backgroundUrl));
  } else if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  return {
    title: event?.title,
    description: event?.description,
    alternates: getAlternates(
      params.lang,
      `${parentMetadata.metadataBase}${Lang.be}/events/${params.slug}`,
      `${parentMetadata.metadataBase}${Lang.nl}/events/${params.slug}`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: event?.title,
      description: event?.description,
      url: `${params.lang}/events/${params.slug}`,
      images,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: event?.title,
      description: event?.description,
      images,
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllEventsSlugs();
}
