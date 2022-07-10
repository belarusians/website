import * as React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";

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
