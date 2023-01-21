import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/layout";
import { Section } from "../../components/section/section";
import { sectionHeading } from "../../components/section/section.css";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer/pdf-viewer").then((mod) => mod.PdfViewer), {
  ssr: false,
});

export default function IndexPage(): JSX.Element {
  const { t } = useTranslation("join-us");

  return (
    <Layout>
      <Section>
        <h1 className={sectionHeading}>{t("targets-heading")}</h1>
        <PDFViewer />
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
