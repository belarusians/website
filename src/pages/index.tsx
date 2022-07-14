import * as React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { Amplify } from "aws-amplify";

import { Layout } from "../components/layout";

// markup
const IndexPage = () => {
  return (
    <>
      <Helmet>
        <title>Belarusians NL</title>
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
