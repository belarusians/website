import Image from 'next/future/image';
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
  fit, whyImage, whatImage, forMeImage, helpImage, animationFadeIn, sectionHeading
} from "../../components/about-us.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useRef } from "react";

export default function IndexPage(): JSX.Element {
  const { t } = useTranslation("about-us");

  const myRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // If the element is visible
        if (entry.isIntersecting) {
          // Add the animation class
          entry.target.classList.add(animationFadeIn);
        }
      });
    });
    //@ts-ignore
    const els = myRef.current.querySelectorAll(':scope > *');
    //@ts-ignore
    els.forEach((i) => {
      if (i) {
        observer.observe(i);
      }
    });
  });



  return (
    <Layout>
      <Section>
        <h1 className={sectionHeading}>{t("heading")}</h1>
        <div className={aboutUs} ref={myRef}>
          <div className={who}>
            <h2 className={heading}>{t("who-heading")}</h2>
            <p>{t("who-text")}</p>
          </div>
          <div className={whoImage}>
            <Image className={fit} src="/news/heart.jpg" fill alt="" />
          </div>

          <div className={why}>
            <h2 className={heading}>{t("why-heading")}</h2>
            <p>{t("why-text")}</p>
          </div>
          <div className={whyImage}>
            <Image className={fit} src="/news/hand.jpg" fill alt="" />
          </div>
          <div className={what}>
            <h2 className={heading}>{t("what-heading")}</h2>
            <p>{t("what-text")}</p>
          </div>
          <div className={whatImage}>
            <Image className={fit} src="/news/mara.jpg" fill alt="" />
          </div>
          <div className={forMe}>
            <h2 className={heading}>{t("for-me-heading")}</h2>
            <p>{t("for-me-text")}</p>
          </div>
          <div className={forMeImage}>
            <Image className={fit} src="/news/other.jpg" fill alt="" />
          </div>
          <div className={help}>
            <h2 className={heading}>{t("help-heading")}</h2>
            <p>{t("help-text")}</p>
            <a href="mailto:mara@belarusians.nl">mara@belarusians.nl</a>, <a href="https://facebook.com/marabynl">facebook</a>, <a href="https://www.instagram.com/marabynl/">instagram</a>
          </div>
          <div className={helpImage}>
            <Image className={fit} src="/news/flowers.jpg" fill alt="" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "about-us"])),
    },
  };
}
