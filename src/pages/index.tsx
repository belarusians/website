import * as React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { Amplify } from "aws-amplify";

import { Layout } from "../components/layout";
import { SEO } from "../components/SEO";

const IndexPage = () => {
  return (
    <>
      <Helmet>
        <title>Belarusians NL</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="hXVTSewNsnJ2_HBXFikyt5I9HeaIv2QypVnUeqcJKvU" />
      </Helmet>
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

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
