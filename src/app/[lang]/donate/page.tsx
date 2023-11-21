import Link from "next/link";

import { CommonPageParams, PageSearchParams } from "../../types";
import { useTranslation } from "../../i18n";
import { Section } from "../../../components/section/section";
import H1 from "../../../components/headings/h1";
import { DonateButtons } from "./donate-buttons";
import { Metadata, ResolvingMetadata } from "next/types";
import { Lang } from "../../../components/types";

export default async function Page({ params }: CommonPageParams & PageSearchParams) {
  // const success: boolean = searchParams?.success !== undefined;

  const { t } = await useTranslation(params.lang, "donate");

  return (
    <Section>
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-20 xl:gap-60">
        <div className="md:basis-1/2 lg:basis-2/3 xl:basis-3/5">
          <H1>{t("heading")}</H1>
          <p>
            {t("text")}
          </p>
        </div>
        <div className="md:basis-1/2 lg:basis-1/3 xl:basis-2/5 grid grid-cols-2 gap-4">
          {/*{ success ?*/}
            <div className="col-span-2 p-2 md:p-4 lg:p-6 rounded-md bg-white shadow-lg flex items-center justify-center">
              <p className="text-center">
                {t("successMsg")}&nbsp;
                <Link href="https://billing.stripe.com/p/login/9AQ6qpfV726XcsU144">{t("customerPortalLink")}</Link>.
              </p>
            </div> : <DonateButtons donateBtnLabel={t("donateBtn")}
                                    recurringLabel={t("recurring")}
                                    donateBtnErrLabel={t("donateBtnErr")}
          />
        </div>
      </div>
    </Section>
  );
}

const titleLang = {
  be: "MARA шукае падтрымку!",
  nl: "MARA zoekt ondersteuning!",
  ru: "МАРА ищет поддержку!",
};

const descriptionLang = {
  be: "Нашыя культурныя і дабрачынныя праекты ажыццяўляюцца з дапамогай чальцоў і сяброў MÁRA. Дзякуючы вашаму ўкладу мы разам зможам рабіць яшчэ больш. Далучайцеся каб падтрымаць культурныя і дабрачынныя праекты MÁRA. Дзякуй!",
  nl: "Onze culturele en liefdadigheidsprojecten worden uitgevoerd met de hulp van MARA-leden en vrienden. Dankzij uw bijdrage kunnen we nog meer samen doen. Sluit u bij ons aan en steun MÁRA's culturele en liefdadigheidsprojecten. Bedankt!",
  ru: "Наши культурные и благотворительные проекты реализуются при помощи членов МАРА и друзей. Благодаря вашему вкладу мы сможем сделать еще больше вместе. Присоединяйтесь, чтобы поддержать культурные и благотворительные проекты MÁRA. Спасибо!",
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    title: titleLang[params.lang],
    description: descriptionLang[params.lang],
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/donate`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/donate`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/donate`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: titleLang[params.lang],
      description: descriptionLang[params.lang],
      url: `${params.lang}/donate`,
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
