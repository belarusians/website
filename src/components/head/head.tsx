import React from "react";
import NextHead from "next/head";

import seo, { SEOConfiguration } from "./config";

export type HeadProps = Pick<SEOConfiguration, "description" | "title" | "siteUrl" | "imageUrl">;

export const Head = (props: Partial<HeadProps>): JSX.Element => {
  return (
    <NextHead>
      <title>{props.title ?? seo.title}</title>

      <meta name="description" content={props.description ?? props.description} />
      <meta name="image" content={props.imageUrl ?? seo.imageUrl} />

      <meta property="og:url" content={props.siteUrl ?? seo.siteUrl} />
      <meta property="og:title" content={props.title ?? seo.title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={props.description ?? seo.description} />
      <meta property="og:image" content={props.imageUrl ?? seo.imageUrl} />
      <meta property="og:image:height" content="301" />
      <meta property="og:image:width" content="574" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={seo.domain} />
      <meta property="twitter:url" content={props.siteUrl ?? seo.siteUrl} />
      <meta name="twitter:title" content={props.title ?? seo.title} />
      <meta name="twitter:description" content={props.description ?? seo.description} />
      <meta name="twitter:image" content={props.imageUrl ?? seo.imageUrl} />
    </NextHead>
  );
};
