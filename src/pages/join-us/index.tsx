import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/layout";
import { Section } from "../../components/section/section";
import { sectionHeading } from "../../components/section/section.css";

export default function IndexPage(): JSX.Element {
  const { t } = useTranslation("join-us");

  return (
    <Layout>
      <Section>
        <h1 className={sectionHeading}>{t("heading")}</h1>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScDh_yhFZYToDEq-WUrrulGbU65c1fJIuuHCT8_raP-xfqYoQ/viewform?embedded=true"
          width="640"
          height="979"
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
