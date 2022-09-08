import * as React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Layout } from "../components/layout";
import { Subscribe } from "../components/subscribe/subscribe";
import { section } from "../components/layout.css";
import { themeClass } from "../components/sprinkles.css";

const IndexPage = () => {
  return (
    <>
      <Layout>
        <Subscribe className={`${section} ${themeClass}`} />
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
