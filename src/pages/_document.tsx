import * as React from "react";
import { Head, Html, Main, NextScript } from "next/document";

import { Favicon } from "../components/favicon/favicon";

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <meta name="google-site-verification" content="hXVTSewNsnJ2_HBXFikyt5I9HeaIv2QypVnUeqcJKvU" />
        <meta name="facebook-domain-verification" content="puzhrq5e71epeox7ohkx5oluv6azvd" />
        <Favicon />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
