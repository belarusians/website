import * as React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import { Section } from "../../components/section/section";
import { CommonPageProps, Lang } from "../../components/types";
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types";

export default function IndexPage(): React.JSX.Element {
  const { t } = useTranslation("about-us");

  return (
    <Section>
      <h1 className="text-xl font-medium md:text-3xl">{t("heading")}</h1>
      <div className="lg:grid grid-cols-4 grid-rows-[20rem_15rem_15rem_20rem_20rem] gap-x-4 gap-y-8 mt-4 md:mt-8 lg:mt-16">
        <div className="self-center col-span-2">
          <h2 className="text-xl md:text-2xl text-red">{t("who-heading")}</h2>
          <p>{t("who-text")}</p>
        </div>
        <div className="col-span-2 relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src="/news/heart.jpg" fill alt="who we are" />
        </div>
        <div className="relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src="/news/mara.jpg" fill alt="what is mara" />
        </div>
        <div className="self-center col-span-3">
          <h2 className="text-xl md:text-2xl text-red">{t("what-heading")}</h2>
          <p>{t("what-text")}</p>
        </div>
        <div className="self-center col-span-2">
          <h2 className="text-xl md:text-2xl text-red">{t("why-heading")}</h2>
          <p>{t("why-text")}</p>
        </div>
        <div className="col-span-2 relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src="/news/other.jpg" fill alt="why do we need mara" />
        </div>
        <div className="self-center col-span-3">
          <h2 className="text-xl md:text-2xl text-red">{t("for-me-heading")}</h2>
          <p>{t("for-me-text")}</p>
        </div>
        <div className="relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src="/abstract/hand.jpg" fill alt="what is mara for me" />
        </div>
        <div className="self-center col-span-1">
          <h2 className="text-xl md:text-2xl text-red">{t("help-heading")}</h2>
          <p>{t("help-text")}</p>
          <a href="mailto:mara@belarusians.nl">mara@belarusians.nl</a>,{" "}
          <a href="https://facebook.com/marabynl">facebook</a>,{" "}
          <a href="https://www.instagram.com/marabynl/">instagram</a>,{" "}
          <a href="https://twitter.com/BelarusinNL">twitter</a>
        </div>
        <div className="col-span-3 relative hidden lg:block rounded-md shadow-lg">
          <Image className="rounded-md object-cover" src="/news/flowers.jpg" fill alt="how can i help" />
        </div>
      </div>
      <h2 className="mt-4 md:mt-6 lg:mt-8 mb-2 text-2xl font-light text-center">{t("partners")}</h2>
      <div className="flex justify-center items-center gap-8">
        <Link className="relative w-36 md:w-48 h-12 md:h-16" href="https://www.libereco.org/">
          <Image className="object-contain" src="/partners/libereco.jpeg" fill alt="libereco partner" />
        </Link>
        <Link className="relative w-12 md:w-20 h-12 md:h-20" href="https://www.facebook.com/musicforbelarus">
          <Image
            className="object-contain"
            src="/partners/music-for-belarus.jpg"
            fill
            alt="music for belarus partner"
          />
        </Link>
      </div>
    </Section>
  );
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<CommonPageProps>> {
  return {
    props: {
      lang: context.locale as Lang,
      ...(await serverSideTranslations(context.locale || Lang.be, ["common", "about-us"])),
    },
  };
}
