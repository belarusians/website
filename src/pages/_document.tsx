import * as React from "react";
import { Head, Html, Main, NextScript } from "next/document";

import { SEO } from "../components/seo/SEO";
import { Favicon } from "../components/favicon/favicon";

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <SEO />
        <Favicon />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
