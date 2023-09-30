import { useTranslation } from "../../i18n";
import { Section } from "../../../components/section/section";
import H1 from "../../../components/headings/h1";
import Form from "./form";
import { CommonPageParams } from "../../types";
import { Metadata, ResolvingMetadata } from "next/types";
import { Lang } from "../../../components/types";

export default async function IndexPage({ params }: CommonPageParams) {
  const { t } = await useTranslation(params.lng, "join-us");

  return (
    <Section>
      <H1>{t("heading")}</H1>
      <div className="mb-2 md:mb-4">
        {/*<Link target="_blank" href={"/targets"}>*/}
        {/*  {t("targets-text")}*/}
        {/*</Link>*/}
      </div>
      <Form />
    </Section>
  );
}

const titleLang = {
  be: "Далучайся да MARA!",
  nl: "Word lid van MARA!",
  ru: "Присоединяйся к MARA!",
};

const descriptionLang = {
  be: "Запоўні форму і далучайся да MARA! Разам мы зможам болей!",
  nl: "Vul het formulier in en word lid van MARA! Samen kunnen we meer doen!",
  ru: "Заполни форму и присоединяйся к MARA! Вместе мы сможем больше!",
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    title: titleLang[params.lng],
    description: descriptionLang[params.lng],
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/join-us`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/join-us`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/join-us`,
        [Lang.ru]: `${parentMetadata.metadataBase}${Lang.ru}/join-us`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: titleLang[params.lng],
      description: descriptionLang[params.lng],
      url: `${params.lng}/join-us`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: titleLang[params.lng],
      description: descriptionLang[params.lng],
    },
  };
}
