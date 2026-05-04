import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';

import { Header } from '../../components/header/header';
import { Footer } from './footer';
import { LangSync } from './lang-sync';
import { PropsWithChildren, JSX } from 'react';
import { CommonPageParams } from '../types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { Lang } from '../../components/types';
import { supportedLngs } from '../i18n/settings';
import { getAlternates } from '../../utils/og';
import { toLang } from '../../utils/lang';
import { ConsentBanner } from '../../components/consent/banner';
import { TabBar } from '../../components/menu/mobile/tabBar';

export const GOOGLE_ADS_TAG_ID = 'AW-11125506805';

export default async function MainLayout({
  children,
  params,
}: PropsWithChildren & CommonPageParams): Promise<JSX.Element> {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  return (
    <ClerkProvider>
      {/* Raw <script> (not next/script): beforeInteractive is only honored in the root layout
          per Next.js docs. An inline, non-async <script> here renders into the SSR HTML in
          document order and executes synchronously before the gtag.js <Script> below — which
          is what Consent Mode v2 requires (defaults must reach dataLayer before gtag.js runs). */}
      <script
        id="gtag-consent-default"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_TAG_ID}');`,
        }}
      />
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_TAG_ID}`} />
      <Script id="gtm-conversion-reporter">
        {`function gtag_report_conversion(value) {
  var callback = function () {};
  gtag('event', 'conversion', {
      'send_to': value,
      'transaction_id': '',
      'event_callback': callback
  });
  return false;
}`}
      </Script>
      <div className="flex flex-col gap-4 lg:gap-6 min-h-screen pb-[88px] md:pb-0">
        <LangSync lang={lang} />
        <Header lang={lang} className="lg:container" />
        <main className="flex flex-col gap-4 lg:gap-6">{children}</main>
        <Footer className="lg:container mt-auto" />
      </div>
      <TabBar lang={lang} />
      <ConsentBanner lang={lang} />
    </ClerkProvider>
  );
}

const titleLang = {
  be: "MARA: Аб'яднанне беларусаў у Нідэрландах",
  nl: 'MARA: Vereniging Belarusen in Nederland',
};

const descriptionLang = {
  be: 'MARA - гэта некамерцыйная арганізацыя неабыякавых беларусаў Нідэрландаў, якія мараць аб цудоўнай будучыні для сваёй роднай краіны.',
  nl: 'MARA is een non-profit organisatie van zorgzame Belarusen in Nederland die dromen van een mooie toekomst voor hun vaderland.',
};

const langToLocale = {
  be: 'be_BY',
  nl: 'nl_NL',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const description = descriptionLang[lang];
  const title = titleLang[lang];

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}`,
      `${parentMetadata.metadataBase}${Lang.nl}`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      locale: langToLocale[lang],
      url: `${parentMetadata.metadataBase}${lang}`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: titleLang[lang],
      description,
    },
  };
}

export function generateStaticParams() {
  return supportedLngs.map((lang) => ({ lang }));
}
