import Link from 'next/link';

import { CommonPageParams, PageSearchParams } from '../../types';
import { getTranslation } from '../../i18n';
import { Section } from '../../../components/section';
import H1 from '../../../components/headings/h1';
import { DonateButtons } from './donate-buttons';
import { Metadata, ResolvingMetadata } from 'next/types';
import { Lang } from '../../../components/types';
import { getAlternates } from '../../../utils/og';

export default async function Page({ params, searchParams }: CommonPageParams & PageSearchParams) {
  const { lang } = await params;
  const awaitedSearchParams = await searchParams;
  const success: boolean = awaitedSearchParams?.success !== undefined;

  const { t } = await getTranslation(lang, 'donate');

  return (
    <Section>
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-20 xl:gap-60">
        <div className="md:basis-1/2 lg:basis-2/3 xl:basis-3/5">
          <H1>{t('heading')}</H1>
          <p>{t('text')}</p>
        </div>
        <div className="md:basis-1/2 lg:basis-1/3 xl:basis-2/5 grid grid-cols-2 gap-4">
          {success ? (
            <div className="col-span-2 p-2 md:p-4 lg:p-6 rounded-md bg-white shadow-lg flex items-center justify-center">
              <p className="text-center">
                {t('successMsg')}&nbsp;
                <Link href="https://billing.stripe.com/p/login/9AQ6qpfV726XcsU144">{t('customerPortalLink')}</Link>.
              </p>
            </div>
          ) : (
            <DonateButtons
              donateBtnLabel={t('donateBtn')}
              recurringLabel={t('recurring')}
              donateBtnErrLabel={t('donateBtnErr')}
            />
          )}
        </div>
      </div>
    </Section>
  );
}

const titleLang = {
  be: 'Вы можаце падтрымаць MARA!',
  nl: 'U kunt MARA steunen!',
};

const descriptionLang = {
  be: 'Нашыя культурныя і дабрачынныя праекты ажыццяўляюцца з дапамогай чальцоў і сяброў MÁRA. Дзякуючы вашаму ўкладу мы разам зможам рабіць яшчэ больш. Далучайцеся каб падтрымаць культурныя і дабрачынныя праекты MÁRA. Дзякуй!',
  nl: "Onze culturele en liefdadigheidsprojecten worden uitgevoerd met de hulp van MARA-leden en vrienden. Dankzij uw bijdrage kunnen we nog meer samen doen. Sluit u bij ons aan en steun MÁRA's culturele en liefdadigheidsprojecten. Bedankt!",
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
      `${parentMetadata.metadataBase}${Lang.be}/donate`,
      `${parentMetadata.metadataBase}${Lang.nl}/donate`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${lang}/donate`,
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
