import { Metadata, ResolvingMetadata } from 'next/types';

import { Event, Lang } from '../../../../components/types';
import { Section } from '../../../../components/section/section';
import { EventArticle } from './event-article';
import { CommonPageParams } from '../../../types';
import { useTranslation } from '../../../i18n';
import { getAllEventsSlugs, getEventBySlug } from '../../../../sanity/event/service';
import { urlForImage } from '../../../../sanity/lib/image';

type EventPageParams = CommonPageParams & {
  params: {
    slug: string;
  };
};

export default async function EventPage({ params }: EventPageParams) {
  const { t } = await useTranslation(params.lang, 'events');
  const event = await getData(params.slug, params.lang);
  if (!event) {
    return <div>Not found</div>;
  }

  return (
    <Section>
      <EventArticle lang={params.lang} event={event} buttonLabel={t('buy-ticket')} />
    </Section>
  );
}

async function getData(slug: string, lang: Lang): Promise<Event | undefined> {
  // TODO: find more clean solution
  const decodedSlug = decodeURIComponent(slug);
  return await getEventBySlug(lang, decodedSlug);
}

export async function generateMetadata({ params }: EventPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const event = await getData(params.slug, params.lang);
  const images = [];
  if (event) {
    images.push(urlForImage(event.backgroundUrl));
  }
  if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  return {
    title: event?.title,
    description: event?.description,
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/events/${params.slug}`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/events/${params.slug}`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/events/${params.slug}`,
      },
    },
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

export async function generateStaticParams({ params }: CommonPageParams): Promise<{ slug: string }[]> {
  return await getAllEventsSlugs(params.lang);
}
