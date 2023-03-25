import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import Link from "next/link";

import { Section } from "../../components/section/section";
import { form, formForeword, sectionHeading } from "../../components/section/section.css";
import { CommonPageProps, Lang } from "../../components/types";
import { Head } from "../../components/head/head";

export default function IndexPage(props: CommonPageProps): JSX.Element {
  const { t } = useTranslation("join-us");

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  // TODO: do something with those magical numbers. Iframe should be well positioned automatically! Without this magic
  const iframeHeight = width > 640 ? 1690 : 2280;

  return (
    <>
      <Head
        lang={props.lang}
        title={t("meta-title") || undefined}
        description={t("meta-description") || undefined}
        imagePath="/news/heart.jpg"
      />
      <Section>
        <h1 className={sectionHeading}>{t("heading")}</h1>
        <div className={formForeword}>
          <Link target="_blank" href={"/targets"}>
            {t("targets-text")}
          </Link>
        </div>
        <iframe
          className={form}
          src="https://docs.google.com/forms/d/e/1FAIpQLSclnC3o9gft51GR9_lNdFoLY79DhKrdw-rR9JtGQ3bbwFltuw/viewform?embedded=true"
          width="100%"
          height={iframeHeight}
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
        >
          Loading…
        </iframe>
      </Section>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<CommonPageProps>> {
  return {
    props: {
      lang: context.locale as Lang,
      ...(await serverSideTranslations(context.locale as Lang, ["common", "join-us"])),
    },
  };
}
