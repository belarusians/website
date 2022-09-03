import * as React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Amplify } from "aws-amplify";

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

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "prodapi",
        endpoint: "https://de31uuzida.execute-api.eu-central-1.amazonaws.com/staging",
      },
    ],
  },
});

export async function getStaticProps(context: any): Promise<any> {
  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
    },
  }
}
