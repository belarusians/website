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

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;900&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
