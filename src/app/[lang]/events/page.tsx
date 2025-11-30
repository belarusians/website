import { getTranslation } from '../../i18n';
import { CommonPageParams } from '../../types';
import { Section } from '../../../components/section';
import H1 from '../../../components/headings/h1';
import H2 from '../../../components/headings/h2';
import { EventThumbnail } from '../event-thumbnail';
import { EventMeta, getAllEvents } from '../../../sanity/event/service';
import { Lang } from '../../../components/types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { getAlternates } from '../../../utils/og';

export default async function EventsPage({ params }: CommonPageParams) {
  const { lang } = await params;
  const { t } = await getTranslation(lang, 'events');

  const events = await getAllEvents(lang);
  const grouped = groupByYear(events);

  return (
    <Section>
      <H1>{t('title')}</H1>
      <div className="flex flex-col gap-4">
        {Object.entries(grouped)
          .reverse()
          .map(([year, events]) => (
            <Year key={year} year={year} events={events} lang={lang} tbaText={t('rescheduled-tba-text')} />
          ))}
      </div>
    </Section>
  );
}

function groupByYear(events: EventMeta[]): { [year: string]: EventMeta[] } {
  const grouped: { [year: string]: EventMeta[] } = {};
  for (const event of events) {
    const year = event.timeframe.start.split('-')[0];
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(event);
  }
  return grouped;
}

function Year({ year, events, lang, tbaText }: { year: string; events: EventMeta[]; lang: Lang; tbaText?: string }) {
  return (
    <div>
      <H2>{year}</H2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
        {events.map((e, i) => (
          <EventThumbnail key={i} event={e} lang={lang} tbaText={tbaText} />
        ))}
      </div>
    </div>
  );
}

const titleLang = {
  be: 'Імпрэзы MARA',
  nl: 'Evenementen van MARA',
};

const descriptionLang = {
  be: 'MARA ладзіць шмат імпрэзаў! Паглядзіце, што мы рабілі, і што ў нас ў планах.',
  nl: 'MARA organiseert veel evenementen! Hier kunt u zien wat we al hebben gedaan en wat we van plan zijn.',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang } = await params;
  const parentMetadata = await parent;

  const images = [];
  if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  const description = descriptionLang[lang];
  const title = titleLang[lang];

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/events`,
      `${parentMetadata.metadataBase}${Lang.nl}/events`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${lang}/events`,
      images,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title,
      description,
      images,
    },
  };
}
