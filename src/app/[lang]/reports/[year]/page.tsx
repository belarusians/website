import { existsSync } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next/types';

import { getTranslation } from '../../../i18n';
import { Section } from '../../../../components/section';
import { PdfViewer } from '../../../../components/pdf-viewer';
import { Lang } from '../../../../components/types';
import H1 from '../../../../components/headings/h1';
import { getAlternates } from '../../../../utils/og';
import { toLang } from '../../../../utils/lang';

const ALLOWED_YEARS = ['2022', '2023', '2024', '2025'] as const;
type ReportYear = (typeof ALLOWED_YEARS)[number];

function isAllowedYear(year: string): year is ReportYear {
  return (ALLOWED_YEARS as readonly string[]).includes(year);
}

interface ReportPageParams {
  params: Promise<{
    lang: string;
    year: string;
  }>;
}

export default async function ReportPage({ params }: ReportPageParams) {
  const { lang: langParam, year } = await params;
  const lang = toLang(langParam);

  if (!isAllowedYear(year)) {
    notFound();
  }

  const { t } = await getTranslation(lang, 'reports');
  const pdfUrl = `/reports/jaarverslag-${year}.pdf`;
  const pdfExists = existsSync(path.join(process.cwd(), 'public', 'reports', `jaarverslag-${year}.pdf`));

  if (year === '2025') {
    return (
      <>
        <Section>
          <H1 className="text-primary text-center">{t('2025-title')}</H1>
          <p className="text-center text-lg md:text-xl lg:text-2xl mt-4 md:mt-8">{t('2025-intro')}</p>
        </Section>

        <Section className="bg-primary py-6 md:py-10">
          <div className="text-center text-white">
            <p className="text-lg md:text-2xl">{t('2025-organized')}</p>
            <p className="text-4xl md:text-7xl font-bold my-2">{t('2025-events-count')}</p>
            <p className="text-lg md:text-2xl">{t('2025-expenses-were')}</p>
            <p className="text-4xl md:text-7xl font-bold mt-2">{t('2025-events-cost')}</p>
          </div>
        </Section>

        <Section>
          <p className="text-center text-lg md:text-xl lg:text-2xl py-4 md:py-8">{t('2025-impossible-without')}</p>
        </Section>

        <Section className="bg-primary py-6 md:py-10">
          <div className="text-center text-white">
            <p className="text-4xl md:text-7xl font-bold">{t('2025-membership-amount')}</p>
            <p className="text-lg md:text-2xl mb-4">{t('2025-membership-label')}</p>
            <p className="text-4xl md:text-7xl font-bold">{t('2025-donations-amount')}</p>
            <p className="text-lg md:text-2xl mb-4">{t('2025-donations-label')}</p>
            <p className="text-4xl md:text-7xl font-bold">{t('2025-tickets-amount')}</p>
            <p className="text-lg md:text-2xl">{t('2025-tickets-label')}</p>
          </div>
        </Section>

        <Section>
          <p className="text-center text-lg md:text-xl lg:text-2xl py-4 md:py-8">{t('2025-gratitude')}</p>
        </Section>

        <Section className="bg-primary py-6 md:py-10">
          <div className="text-center text-white">
            <p className="text-lg md:text-2xl">{t('2025-ministry-intro')}</p>
            <p className="text-4xl md:text-7xl font-bold my-2">{t('2025-ministry-amount')}</p>
            <p className="text-lg md:text-2xl">{t('2025-ministry-label')}</p>
          </div>
        </Section>

        <Section>
          <p className="text-center text-lg md:text-xl lg:text-2xl py-4 md:py-8">{t('2025-solidarity-text')}</p>
        </Section>

        <Section className="bg-primary py-6 md:py-10">
          <div className="text-center text-white">
            <p className="text-4xl md:text-7xl font-bold">{t('2025-solidarity-amount')}</p>
            <p className="text-lg md:text-2xl">{t('2025-solidarity-label')}</p>
          </div>
        </Section>

        <Section>
          <p className="text-center text-lg md:text-xl lg:text-2xl py-4 md:py-8">
            {t('2025-closing-before-link')}
            <Link href={`/${lang}/join-us`} className="text-primary underline">
              {t('2025-join-link')}
            </Link>
            {t('2025-closing-after-link')}
          </p>
        </Section>

        {pdfExists && (
          <Section>
            <h2 className="text-primary text-center text-2xl md:text-3xl font-bold mb-6">
              {t('pdf-section-title')}
            </h2>
            <PdfViewer pdfUrl={pdfUrl} downloadLabel={t('download-pdf')} />
          </Section>
        )}
      </>
    );
  }

  return (
    <>
      <Section>
        <H1 className="text-primary text-center">{t(`report-title-${year}`)}</H1>
      </Section>

      {pdfExists && (
        <Section>
          <PdfViewer pdfUrl={pdfUrl} downloadLabel={t('download-pdf')} />
        </Section>
      )}
    </>
  );
}

const titleLang: Record<Lang, (year: string) => string> = {
  be: (year) => `Справаздача за ${year} год | Мара`,
  nl: (year) => `Jaarverslag ${year} | MARA`,
};

const descriptionLang: Record<Lang, (year: string) => string> = {
  be: (year) => `Гадавая справаздача MARA за ${year} год. Фінансавыя вынікі і дасягненні арганізацыі.`,
  nl: (year) => `Jaarverslag van MARA over ${year}. Financiële resultaten en prestaties van de organisatie.`,
};

export async function generateMetadata({ params }: ReportPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang: langParam, year } = await params;
  const lang = toLang(langParam);

  if (!isAllowedYear(year)) {
    return {};
  }

  const parentMetadata = await parent;

  return {
    title: titleLang[lang](year),
    description: descriptionLang[lang](year),
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/reports/${year}`,
      `${parentMetadata.metadataBase}${Lang.nl}/reports/${year}`,
    ),
  };
}
