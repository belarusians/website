import * as React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { Amplify } from "aws-amplify";

import { Layout } from "../components/layout";
import "./index.css";

// markup
const IndexPage = () => {
  return (
    <>
      <Helmet>
        <title>Belarusians NL</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
      </Helmet>
      <Layout></Layout>
    </>
  );
};

export default IndexPage;

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "subscribe",
        endpoint: "https://x2z9ll0k6i.execute-api.eu-central-1.amazonaws.com/staging",
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
