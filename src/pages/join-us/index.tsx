import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/layout";
import { Section } from "../../components/section/section";
import { form, sectionHeading } from "../../components/section/section.css";
import { useEffect, useState } from "react";

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
  const iframeHeight = width > 640 ? 1300 : 1700;

  return (
    <Layout>
      <Section>
        <h1 className={sectionHeading}>{t("heading")}</h1>
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

export async function getStaticProps(context: any) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "join-us"])),
    },
  };
}
