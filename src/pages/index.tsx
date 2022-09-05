import * as React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Layout } from "../components/layout";
import { SEO } from "../components/SEO";

const IndexPage = () => {
  return (
    <>
      <SEO />
      <Layout></Layout>
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
