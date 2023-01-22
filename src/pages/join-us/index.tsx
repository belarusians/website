import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next/types";
import Link from "next/link";

import { Layout } from "../../components/layout";
import { Section } from "../../components/section/section";
import { form, formForeword, sectionHeading } from "../../components/section/section.css";
import { Lang } from "../../components/types";

export default function IndexPage(): JSX.Element {
  const { t } = useTranslation("join-us");

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  // TODO: do something with those magical numbers. Iframe should be well positioned automatically! Without this magic
  const iframeWidth = width > 640 ? 640 : width - 20;
  const iframeHeight = width > 640 ? 1450 : 1800;

  return (
    <Layout>
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
          width={iframeWidth}
          height={iframeHeight}
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
        >
          Loading…
        </iframe>
      </Section>
    </Layout>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as Lang, ["common", "join-us"])),
    },
  };
}
