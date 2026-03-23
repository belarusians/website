import { getTranslation } from '../../i18n';
import { CommonPageParams } from '../../types';
import { Section } from '../../../components/section';
import H1 from '../../../components/headings/h1';
import H2 from '../../../components/headings/h2';
import { NewsThumbnail } from '../news-thumbnail';
import { NewsMeta, getAllNewsMetas } from '../../../sanity/news/service';
import { Lang } from '../../../components/types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { getAlternates } from '../../../utils/og';
import { toLang } from '../../../utils/lang';

export default async function NewsPage({ params }: CommonPageParams) {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const { t } = await getTranslation(lang, 'common');

  const news = await getAllNewsMetas(lang);
  const grouped = groupByYear(news);

  return (
    <Section>
      <H1>{t('news')}</H1>
      <div className="flex flex-col gap-4">
        {Object.entries(grouped)
          .reverse()
          .map(([year, newsItems]) => (
            <Year key={year} year={year} news={newsItems} lang={lang} />
          ))}
      </div>
    </Section>
  );
}

function groupByYear(news: NewsMeta[]): { [year: string]: NewsMeta[] } {
  const grouped: { [year: string]: NewsMeta[] } = {};
  for (const item of news) {
    const year = item.publishingDate?.split('-')[0] || 'Unknown';
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(item);
  }
  return grouped;
}

function Year({ year, news, lang }: { year: string; news: NewsMeta[]; lang: Lang }) {
  return (
    <div>
      <H2>{year}</H2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {news.map((n, i) => (
          <NewsThumbnail
            key={i}
            news={n}
            lang={lang}
            size="small"
            className="h-[160px] shadow-lg hover:shadow-xl transition-all"
          />
        ))}
      </div>
    </div>
  );
}

const titleLang = {
  be: 'Навіны MARA',
  nl: 'Nieuws van MARA',
};

const descriptionLang = {
  be: 'Усе навіны аб дзейнасці MARA і беларускай супольнасці ў Нідэрландах.',
  nl: 'Al het nieuws over de activiteiten van MARA en de Belarusische gemeenschap in Nederland.',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
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
      `${parentMetadata.metadataBase}${Lang.be}/news`,
      `${parentMetadata.metadataBase}${Lang.nl}/news`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${parentMetadata.metadataBase}${lang}/news`,
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
