import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next/types';

import { getTranslation } from '../../i18n';
import { Section } from '../../../components/section';
import { Lang } from '../../../components/types';
import H1 from '../../../components/headings/h1';
import Card from '../../../components/card';
import { CommonPageParams } from '../../types';
import { getAlternates } from '../../../utils/og';
import { toLang } from '../../../utils/lang';

export default async function Help({ params }: CommonPageParams) {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const { t } = await getTranslation(lang, 'help');
  const { t: tCommon } = await getTranslation(lang);

  return (
    <Section>
      <H1>{tCommon('useful-info')}</H1>
      <p className="mb-6 md:mb-8">{t('intro')}</p>
      <ul className="flex flex-col gap-4 md:gap-6">
        <li>
          <Link href={`/${lang}/alien-passport`} className="no-underline">
            <Card className="hover:shadow-2xl">
              <span className="text-lg md:text-xl font-medium text-primary">{tCommon('alien-passport')}</span>
              <span className="mt-1">{t('alien-passport-description')}</span>
            </Card>
          </Link>
        </li>
        <li>
          <Link
            href="https://t.me/belarusians_nl_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Card className="hover:shadow-2xl">
              <span className="text-lg md:text-xl font-medium text-primary">{tCommon('refugees-bot')}</span>
              <span className="mt-1">{t('refugees-bot-description')}</span>
            </Card>
          </Link>
        </li>
      </ul>
    </Section>
  );
}

const titleLang = {
  be: 'Карысная інфа — MARA',
  nl: 'Nuttige info — MARA',
};

const descriptionLang = {
  be: 'Карысныя рэсурсы для беларусаў у Нідэрландах.',
  nl: 'Nuttige bronnen voor Belarusen in Nederland.',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const parentMetadata = await parent;

  const title = titleLang[lang];
  const description = descriptionLang[lang];

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/help`,
      `${parentMetadata.metadataBase}${Lang.nl}/help`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${parentMetadata.metadataBase}${lang}/help`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title,
      description,
    },
  };
}
