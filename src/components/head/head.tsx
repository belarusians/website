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

const langToLocale = {
  be: "be_BY",
  nl: "nl_NL",
  ru: "ru_BY",
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

      <meta name="keywords" content="mara, belarus, wit-rusland, belarus diaspora" />
      <meta name="robots" content="index, follow" />

      <meta name="description" content={props.description ?? seo.description[lang]} key="meta-description" />
      <meta name="image" content={imageUrl} key="meta-image" />

      <meta property="og:url" content={props.siteUrl ?? seo.siteUrl[lang]} key="meta-og:url" />
      <meta property="og:title" key="meta-og:title" content={props.title ?? seo.title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" key="meta-og:description" content={props.description ?? seo.description[lang]} />
      <meta property="og:image" key="meta-og:image" content={imageUrl} />
      <meta property="og:site_name" key="meta-og:site_name" content={seo.siteName} />
      <meta property="og:image:height" content="301" />
      <meta property="og:image:width" content="574" />
      <meta property="og:locale" content={langToLocale[lang]} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" key="meta-twitter:domain" content={seo.domain} />
      <meta property="twitter:url" key="meta-twitter:url" content={props.siteUrl ?? seo.siteUrl[lang]} />
      <meta name="twitter:title" key="meta-twitter:title" content={props.title ?? seo.title} />
      <meta
        name="twitter:description"
        key="meta-twitter:description"
        content={props.description ?? seo.description[lang]}
      />
      <meta name="twitter:image" key="meta-twitter:image" content={imageUrl} />
    </NextHead>
  );
};
