import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import * as React from "react";

import { getEventBySlug } from "../../lib/articles";
import { getEventsSlugs } from "../../lib/fs";
import { CommonPageProps, Lang, Event } from "../../components/types";
import { Section } from "../../components/section/section";
import { Head } from "../../components/head/head";
import { EventArticle } from "../../components/articles/event-article";

interface EventPageProps extends CommonPageProps {
  event?: Event;
}

export default function EventPage(props: EventPageProps): JSX.Element {
  if (!props.event) {
    return <h1>404</h1>;
  }

  return (
    <>
      <Head
        lang={props.lang}
        description={props.event.description || undefined}
        title={props.event.title}
        imagePath={props.event.backgroundUrl}
      />
      <Section>
        <EventArticle event={props.event} />
      </Section>
    </>
  );
}

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<EventPageProps>> {
  if (!params) {
    return {
      props: {},
    };
  }
  const lang = (locale as Lang) || Lang.be;
  const event = await getEventBySlug(params.slug as string, lang);

  return {
    props: {
      event,
      lang,
      ...(await serverSideTranslations(lang, ["common", "events"])),
    },
  };
}

type StaticPaths = { params: { slug: string }; locale?: string }[];

export function getStaticPaths({ locales }: GetStaticPathsContext): GetStaticPathsResult<{ slug: string }> {
  const paths: StaticPaths = getEventsSlugs().reduce<StaticPaths>((acc, file) => {
    acc.push(
      ...(locales || []).map((locale) => ({
        params: { slug: file },
        locale,
      })),
    );

    return acc;
  }, [] as StaticPaths);
  return {
    paths,
    fallback: false,
  };
}
