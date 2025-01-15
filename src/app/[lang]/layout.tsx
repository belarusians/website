import { Header } from '../../components/header/header';
import { Footer } from './footer';
import { PropsWithChildren, JSX } from 'react';
import { CommonPageParams } from '../types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { Lang } from '../../components/types';
import { supportedLngs } from '../i18n/settings';
import { getAlternates } from '../../utils/og';

export default async function MainLayout({
  children,
  params,
}: PropsWithChildren & CommonPageParams): Promise<JSX.Element> {
  const { lang } = await params;
  return (
    <div className="flex flex-col gap-4 lg:gap-6 min-h-screen">
      <Header lang={lang} className="lg:container" />
      {children}
      <Footer className="lg:container mt-auto" />
    </div>
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
  const { lang } = await params;
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
