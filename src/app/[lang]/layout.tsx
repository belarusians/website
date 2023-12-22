import { Header } from '../../components/header/header';
import { Footer } from './footer';
import { PropsWithChildren } from 'react';
import { CommonPageParams } from '../types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { Lang } from '../../components/types';
import { supportedLngs } from '../i18n/settings';

export default function MainLayout({ children, params }: PropsWithChildren & CommonPageParams) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen">
      <Header lang={params.lang} className="lg:container" />
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
  const description = descriptionLang[params.lang];
  const title = titleLang[params.lang];

  return {
    title,
    description,
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      locale: langToLocale[params.lang],
      url: `${parentMetadata.metadataBase}${params.lang}`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: titleLang[params.lang],
      description,
    },
  };
}

export function generateStaticParams() {
  return supportedLngs.map((lang) => ({ lang }));
}
