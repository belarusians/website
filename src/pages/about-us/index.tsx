import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import { Section } from "../../components/section/section";
import {
  whoImage,
  heading2,
  what,
  who,
  why,
  forMe,
  help,
  aboutUs,
  fit,
  whyImage,
  whatImage,
  forMeImage,
  helpImage,
  partners,
  partnersHeading,
  partnerLogo,
  libereco,
  mfb,
} from "../../components/about-us.css";
import { sectionHeading } from "../../components/section/section.css";
import { CommonPageProps, Lang } from "../../components/types";
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types";

export default function IndexPage(): JSX.Element {
  const { t } = useTranslation("about-us");

  return (
    <Section>
      <h1 className={sectionHeading}>{t("heading")}</h1>
      <div className={aboutUs}>
        <div className={who}>
          <h2 className={heading2}>{t("who-heading")}</h2>
          <p>{t("who-text")}</p>
        </div>
        <div className={whoImage}>
          <Image className={fit} src="/news/heart.jpg" fill alt="who we are" />
        </div>
        <div className={what}>
          <h2 className={heading2}>{t("what-heading")}</h2>
          <p>{t("what-text")}</p>
        </div>
        <div className={whatImage}>
          <Image className={fit} src="/news/mara.jpg" fill alt="what is mara" />
        </div>
        <div className={why}>
          <h2 className={heading2}>{t("why-heading")}</h2>
          <p>{t("why-text")}</p>
        </div>
        <div className={whyImage}>
          <Image className={fit} src="/news/other.jpg" fill alt="why do we need mara" />
        </div>
        <div className={forMe}>
          <h2 className={heading2}>{t("for-me-heading")}</h2>
          <p>{t("for-me-text")}</p>
        </div>
        <div className={forMeImage}>
          <Image className={fit} src="/abstract/hand.jpg" fill alt="what is mara for me" />
        </div>
        <div className={help}>
          <h2 className={heading2}>{t("help-heading")}</h2>
          <p>{t("help-text")}</p>
          <a href="mailto:mara@belarusians.nl">mara@belarusians.nl</a>,{" "}
          <a href="https://facebook.com/marabynl">facebook</a>,{" "}
          <a href="https://www.instagram.com/marabynl/">instagram</a>,{" "}
          <a href="https://twitter.com/BelarusinNL">twitter</a>
        </div>
        <div className={helpImage}>
          <Image className={fit} src="/news/flowers.jpg" fill alt="how can i help" />
        </div>
      </div>
      <h2 className={partnersHeading}>{t("partners")}</h2>
      <div className={partners}>
        <Link className={libereco} href="https://www.libereco.org/">
          <Image className={partnerLogo} src="/partners/libereco.jpeg" fill alt="libereco partner" />
        </Link>
        <Link className={mfb} href="https://www.facebook.com/musicforbelarus">
          <Image className={partnerLogo} src="/partners/music-for-belarus.jpg" fill alt="music for belarus partner" />
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
