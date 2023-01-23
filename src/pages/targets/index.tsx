import dynamic from "next/dynamic";
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Section } from "../../components/section/section";
import { sectionHeading } from "../../components/section/section.css";
import { CommonPageProps, Lang } from "../../components/types";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer/pdf-viewer").then((mod) => mod.PdfViewer), {
  ssr: false,
});

export default function IndexPage(): JSX.Element {
  const { t } = useTranslation("join-us");

  return (
    <Section>
      <h1 className={sectionHeading}>{t("targets-heading")}</h1>
      <i>{t("targets-foreword")}</i>
      <PDFViewer />
    </Section>
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