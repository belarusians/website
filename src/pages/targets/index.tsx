import dynamic from "next/dynamic";
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Section } from "../../components/section/section";
import { CommonPageProps, Lang } from "../../components/types";
import { Head } from "../../components/head/head";
import * as React from "react";
import H1 from "../../components/headinds/h1";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer/pdf-viewer").then((mod) => mod.PdfViewer), {
  ssr: false,
});

export default function IndexPage(props: CommonPageProps): JSX.Element {
  const { t } = useTranslation("targets");

  return (
    <>
      <Head
        lang={props.lang}
        title={t("meta-title") || undefined}
        description={t("targets-foreword") || undefined}
        imagePath="/news/flowers.jpg"
      />
      <Section>
        <H1>{t("heading")}</H1>
        <i>{t("targets-foreword")}</i>
        <PDFViewer />
      </Section>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<CommonPageProps>> {
  return {
    props: {
      lang: context.locale as Lang,
      ...(await serverSideTranslations(context.locale as Lang, ["common", "targets"])),
    },
  };
}
