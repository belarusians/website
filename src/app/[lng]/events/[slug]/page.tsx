import { Metadata, ResolvingMetadata } from "next/types";

import { getEventBySlug } from "../../../../lib/articles";
import { getEventsSlugs } from "../../../../lib/fs";
import { Event, Lang } from "../../../../components/types";
import { Section } from "../../../../components/section/section";
import { EventArticle } from "./event-article";
import { CommonPageParams } from "../../../types";
import { useTranslation } from "../../../i18n";

interface EventPageParams {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageParams & CommonPageParams) {
  const { t } = await useTranslation(params.lng, "events");
  const event = await getData(params.slug, params.lng);

  return (
    <Section>
      <EventArticle lang={params.lng} event={event} buttonLabel={t("buy-ticket")} />
    </Section>
  );
}

async function getData(slug: string, lang: Lang): Promise<Event> {
  return await getEventBySlug(slug, lang);
}

export async function generateMetadata(
  { params }: EventPageParams & CommonPageParams,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;
  const event = await getData(params.slug, params.lng);

  return {
    title: event.title,
    description: event.description,
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/news/${params.slug}`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/news/${params.slug}`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/news/${params.slug}`,
        [Lang.ru]: `${parentMetadata.metadataBase}${Lang.ru}/news/${params.slug}`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: event.title,
      description: event.description,
      url: `${params.lng}/news/${params.slug}`,
      images: [event.backgroundUrl],
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: event.title,
      description: event.description,
      images: [event.backgroundUrl],
    },
  };
}

export function generateStaticParams() {
  return getEventsSlugs().map((slug) => ({ slug }));
}
