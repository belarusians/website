import React from "react";
import NextHead from "next/head";

import seo, { SEOConfiguration } from "./config";
import { Lang } from "../types";

export type HeadProps = Pick<SEOConfiguration, "title"> & {
  description?: string;
  siteUrl?: string;
  lang?: Lang;
  imagePath?: string;
};

export const Head = (props: Partial<HeadProps>): JSX.Element => {
  const lang = props.lang ?? Lang.be;
  let imageUrl = seo.imageUrl;
  if (props.imagePath) {
    imageUrl = `${seo.siteUrl[lang]}${props.imagePath}`;
  }

  return (
    <NextHead>
      <title>{props.title ?? seo.title}</title>

      <meta name="description" content={props.description ?? seo.description[lang]} />
      <meta name="image" content={imageUrl} />

      <meta property="og:url" content={props.siteUrl ?? seo.siteUrl[lang]} />
      <meta property="og:title" content={props.title ?? seo.title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={props.description ?? seo.description[lang]} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:height" content="301" />
      <meta property="og:image:width" content="574" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={seo.domain} />
      <meta property="twitter:url" content={props.siteUrl ?? seo.siteUrl[lang]} />
      <meta name="twitter:title" content={props.title ?? seo.title} />
      <meta name="twitter:description" content={props.description ?? seo.description[lang]} />
      <meta name="twitter:image" content={imageUrl} />
    </NextHead>
  );
};
