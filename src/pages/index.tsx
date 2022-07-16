import * as React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { Amplify } from "aws-amplify";

import { Layout } from "../components/layout";

// markup
const IndexPage = () => {
  const description = "Official website of Belarusian diaspora in the Netherlands - MARA";
  const title = "Mara - Belarusians NL";
  const url = "https://www.belarusians.nl/";
  return (
    <>
      <Helmet>
        <title>Belarusians NL</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="hXVTSewNsnJ2_HBXFikyt5I9HeaIv2QypVnUeqcJKvU" />

        <meta name="title" content={title} />
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="../images/logo.jpeg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="../images/logo.jpeg" />
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
