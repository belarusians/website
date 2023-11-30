import dynamic from 'next/dynamic';

import { Section } from '../section';

const PDFViewer = dynamic(() => import('../../components/pdf-viewer/pdf-viewer').then((mod) => mod.PdfViewer), {
  ssr: false,
});

export default function IndexPage() {
  return (
    <>
      {/*<Head*/}
      {/*  lang={props.lang}*/}
      {/*  title={t("meta-title") || undefined}*/}
      {/*  description={t("targets-foreword") || undefined}*/}
      {/*  imagePath="/news/flowers.jpg"*/}
      {/*/>*/}
      <Section>
        {/*<H1>{t("heading")}</H1>*/}
        {/*<i>{t("targets-foreword")}</i>*/}
        <PDFViewer />
      </Section>
    </>
  );
}
