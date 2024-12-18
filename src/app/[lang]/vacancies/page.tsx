import Link from 'next/link';

import { useTranslation } from '../../i18n';
import { Lang } from '../../../components/types';
import { Section } from '../../../components/section';
import H1 from '../../../components/headings/h1';
import { VacancyPreview } from './vacancy-preview';
import { CommonPageParams } from '../../types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { Vacancy } from '../../../sanity/vacancy/type';
import { getVacanciesByLang } from '../../../sanity/vacancy/service';
import { getAlternates } from '../../../utils/og';

export const revalidate = 3600;

export default async function VacanciesPage({ params }: CommonPageParams) {
  const { lang } = await params;
  const { t } = await useTranslation(lang, 'vacancies');
  const vacancies = await getData(lang);

  return (
    <Section>
      {vacancies.length ? (
        <>
          <H1 className="mb-2 md:mb-8">{t('heading')}</H1>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vacancies.map((vacancy, i) => (
              <Link className="no-underline" href={`/${lang}/vacancies/${vacancy.id}`} key={i}>
                <VacancyPreview vacancy={vacancy} buttonLabel={t('more-button')} />
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="text-lg">
          <span>{t('no-vacancies')}</span> <a href="mailto:mara@belarusians.nl">mara@belarusians.nl</a>
        </p>
      )}
    </Section>
  );
}

async function getData(lang: Lang): Promise<Vacancy[]> {
  return getVacanciesByLang(lang);
}

const titleLang = {
  be: 'Мара шукае кадры!',
  nl: 'Mara zoekt personeel!',
};

const descriptionLang = {
  be: 'Ты хочаш дапамагчы нашай Мары? Можа быць мы шукаем менавіта цябе! Глядзі нашыя вакансіі і пішы нам, калі знойдзеш нешта для сябе.',
  nl: 'Wil jij onze Mara helpen? Misschien zijn wij wel op zoek naar jou! Bekijk onze vacatures en schrijf ons als je iets voor jezelf vindt.',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang } = await params;
  const parentMetadata = await parent;
  const description = descriptionLang[lang];
  const title = titleLang[lang];

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/vacancies`,
      `${parentMetadata.metadataBase}${Lang.nl}/vacancies`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${lang}/vacancies`,
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
