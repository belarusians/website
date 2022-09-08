import * as React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Layout } from "../components/layout";
import { Section } from "../components/section/section";
import { Subscribe } from "../components/subscribe/subscribe";
import { section } from "../components/layout.css";

const IndexPage = () => {
  return (
    <>
      <Layout>
        <Section>
          <Subscribe className={section} />
        </Section>
      </Layout>
    </>
  );
};

export default IndexPage;

export async function getStaticProps(context: any): Promise<any> {
  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
    },
  }
}
