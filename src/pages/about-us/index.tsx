import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import { Layout } from "../../components/layout";
import { Section } from "../../components/section/section";
import {
  whoImage,
  heading,
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
import { Lang } from "../../components/types";
import { GetStaticPropsContext } from "next/types";

export default function IndexPage(): JSX.Element {
  const { t } = useTranslation("about-us");

  return (
    <Layout>
      <Section>
        <h1 className={sectionHeading}>{t("heading")}</h1>
        <div className={aboutUs}>
          <div className={who}>
            <h2 className={heading}>{t("who-heading")}</h2>
            <p>{t("who-text")}</p>
          </div>
          <div className={whoImage}>
            <Image className={fit} src="/news/heart.jpg" fill alt="" />
          </div>
          <div className={what}>
            <h2 className={heading}>{t("what-heading")}</h2>
            <p>{t("what-text")}</p>
          </div>
          <div className={whatImage}>
            <Image className={fit} src="/news/mara.jpg" fill alt="" />
          </div>
          <div className={why}>
            <h2 className={heading}>{t("why-heading")}</h2>
            <p>{t("why-text")}</p>
          </div>
          <div className={whyImage}>
            <Image className={fit} src="/news/other.jpg" fill alt="" />
          </div>
          <div className={forMe}>
            <h2 className={heading}>{t("for-me-heading")}</h2>
            <p>{t("for-me-text")}</p>
          </div>
          <div className={forMeImage}>
            <Image className={fit} src="/news/hand.jpg" fill alt="" />
          </div>
          <div className={help}>
            <h2 className={heading}>{t("help-heading")}</h2>
            <p>{t("help-text")}</p>
            <a href="mailto:mara@belarusians.nl">mara@belarusians.nl</a>,{" "}
            <a href="https://facebook.com/marabynl">facebook</a>,{" "}
            <a href="https://www.instagram.com/marabynl/">instagram</a>,{" "}
            <a href="https://twitter.com/BelarusinNL">twitter</a>
          </div>
          <div className={helpImage}>
            <Image className={fit} src="/news/flowers.jpg" fill alt="" />
          </div>
        </div>
        <h1 className={partnersHeading}>{t("partners")}</h1>
        <div className={partners}>
          <Link className={libereco} href="https://www.libereco.org/">
            <Image className={partnerLogo} src="/partners/libereco.jpeg" fill alt="" />
          </Link>
          <Link className={mfb} href="https://www.facebook.com/musicforbelarus">
            <Image className={partnerLogo} src="/partners/music-for-belarus.jpg" fill alt="" />
          </Link>
        </div>
      </Section>
    </Layout>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || Lang.be, ["common", "about-us"])),
    },
  };
}
