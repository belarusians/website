import React from "react";
import seo from "./config";

export const SEO = (): JSX.Element => {
  return (
    <>
      <title>{seo.title}</title>
      <meta name="google-site-verification" content="hXVTSewNsnJ2_HBXFikyt5I9HeaIv2QypVnUeqcJKvU" />
      <meta name="facebook-domain-verification" content="puzhrq5e71epeox7ohkx5oluv6azvd" />

      <meta name="description" content={seo.description} />
      <meta name="image" content={`${seo.siteUrl}${seo.imagePath}`} />

      <meta property="og:url" content={seo.siteUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={`${seo.siteUrl}${seo.imagePath}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="belarusians.nl" />
      <meta property="twitter:url" content={seo.siteUrl} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={`${seo.siteUrl}${seo.imagePath}`} />
    </>
  );
};