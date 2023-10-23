import { Header } from "../../components/header/header";
import { Footer } from "./footer";
import { PropsWithChildren } from "react";
import { CommonPageParams } from "../types";
import { Metadata, ResolvingMetadata } from "next/types";
import { Lang } from "../../components/types";
import { supportedLngs } from "../i18n/settings";

export default function MainLayout({ children, params }: PropsWithChildren & CommonPageParams) {
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <Header lang={params.lang} className="lg:container" />
        <main className="mb-auto">{children}</main>
        <Footer className="lg:container" />
      </div>
    </>
  );
}

const titleLang = {
  be: "MARA: Аб'яднанне беларусаў у Нідэрландах",
  nl: "MARA: Vereniging Belarusen in Nederland",
  ru: "MARA: Объединение беларусов в Нидерландах",
};

const descriptionLang = {
  be: "MARA - гэта некамерцыйная арганізацыя неабыякавых беларусаў Нідэрландаў, якія мараць аб цудоўнай будучыні для сваёй роднай краіны.",
  nl: "MARA is een non-profit organisatie van zorgzame Belarusen in Nederland die dromen van een mooie toekomst voor hun vaderland.",
  ru: "MARA - это некоммерческая организация небезразличных беларусов Нидерландов, которые мечтают о прекрасном будущем для своей родной страны.",
};

const langToLocale = {
  be: "be_BY",
  nl: "nl_NL",
  ru: "ru_BY",
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    title: titleLang[params.lang],
    description: descriptionLang[params.lang],
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}`,
        [Lang.ru]: `${parentMetadata.metadataBase}${Lang.ru}`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: titleLang[params.lang],
      description: descriptionLang[params.lang],
      locale: langToLocale[params.lang],
      url: `${parentMetadata.metadataBase}${params.lang}`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: titleLang[params.lang],
      description: descriptionLang[params.lang],
    },
  };
}

export function generateStaticParams() {
  return supportedLngs.map((lang) => ({ lang }));
}
