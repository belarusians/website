import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next/types";
import Link from "next/link";

import { useTranslation } from "../../i18n";
import { Section } from "../../../components/section/section";
import { Lang } from "../../../components/types";
import H1 from "../../../components/headings/h1";
import H3 from "../../../components/headings/h3";
import { CommonPageParams } from "../../types";
import Card from "../../../components/card";

import libereco from "../../../../public/partners/libereco.jpeg";
import musicForBelarus from "../../../../public/partners/music-for-belarus.jpg";
import heart from "../../../../public/images/heart.jpg";
import mara from "../../../../public/images/mara.jpg";
import other from "../../../../public/images/other.jpg";
import flowers from "../../../../public/images/flowers.jpg";
import hand from "../../../../public/images/hand.jpg";

export default async function AboutUs({ params: { lang } }: CommonPageParams) {
  const { t } = await useTranslation(lang, "about-us");

  return (
    <Section>
      <H1>{t("heading")}</H1>
      <div className="lg:grid grid-cols-4 grid-rows-[20rem_15rem_15rem_20rem_20rem] gap-x-4 gap-y-8 mt-4 md:mt-8 lg:mt-16">
        <div className="self-center col-span-2">
          <H3 className="text-red">{t("who-heading")}</H3>
          <p>{t("who-text")}</p>
        </div>
        <div className="col-span-2 relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src={heart} fill alt="who we are" />
        </div>
        <div className="relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src={mara} fill alt="what is mara" />
        </div>
        <div className="self-center col-span-3">
          <H3 className="text-red">{t("what-heading")}</H3>
          <p>{t("what-text")}</p>
        </div>
        <div className="self-center col-span-2">
          <H3 className="text-red">{t("why-heading")}</H3>
          <p>{t("why-text")}</p>
        </div>
        <div className="col-span-2 relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src={other} fill alt="why do we need mara" />
        </div>
        <div className="self-center col-span-3">
          <H3 className="text-red">{t("for-me-heading")}</H3>
          <p>{t("for-me-text")}</p>
        </div>
        <div className="relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src={hand} fill alt="what is mara for me" />
        </div>
        <div className="self-center col-span-1">
          <H3 className="text-red">{t("help-heading")}</H3>
          <p>{t("help-text")}</p>
          <a href="mailto:mara@belarusians.nl">mara@belarusians.nl</a>,{" "}
          <a href="https://facebook.com/marabynl">facebook</a>,{" "}
          <a href="https://www.instagram.com/marabynl/">instagram</a>,{" "}
          <a href="https://twitter.com/BelarusinNL">twitter</a>
        </div>
        <div className="col-span-3 relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src={flowers} fill alt="how can i help" />
        </div>
      </div>
      <H3 className="mt-4 md:mt-6 lg:mt-8 mb-2 text-center">{t("partners")}</H3>
      <div className="flex justify-center items-center gap-8">
        <Link className="relative w-36 md:w-48 h-12 md:h-16" href="https://www.libereco.org/">
          <Card>
            <Image className="object-contain rounded-md px-2" src={libereco} fill alt="libereco partner" />
          </Card>
        </Link>
        <Link className="relative w-12 md:w-20 h-12 md:h-20" href="https://www.facebook.com/musicforbelarus">
          <Card>
            <Image className="object-contain rounded-md" src={musicForBelarus} fill alt="music for belarus partner" />
          </Card>
        </Link>
      </div>
    </Section>
  );
}

export async function generateMetadata(params: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/about-us`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/about-us`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/about-us`,
      },
    },
  };
}
