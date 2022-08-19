import React from "react";
import Head from "next/head";
// @ts-ignore
import logo from "../../public/logo.jpeg";
import seo from "../config";

export const SEO = (): JSX.Element => {
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="google-site-verification" content="hXVTSewNsnJ2_HBXFikyt5I9HeaIv2QypVnUeqcJKvU" />
      <meta name="facebook-domain-verification" content="puzhrq5e71epeox7ohkx5oluv6azvd" />

      <meta name="description" content={seo.description} />
      <meta name="image" content={`${seo.siteUrl}${logo}`} />

      <meta property="og:url" content={seo.siteUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={`${seo.siteUrl}${logo}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.siteUrl} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={`${seo.siteUrl}${logo}`} />
    </Head>
  );
};
