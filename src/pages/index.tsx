import * as React from "react";
import { Helmet } from "react-helmet";
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
