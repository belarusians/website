import React from "react";
import NextHead from "next/head";

import seo from "./config";
import { Lang } from "../types";
import { useRouter } from "next/router";

export type HeadProps = {
  title?: string;
  description?: string;
  lang?: Lang;
  imagePath?: string;
};

const langToLocale = {
  be: "be_BY",
  nl: "nl_NL",
  ru: "ru_BY",
};

function renderCanonicalLink(path: string, language: Lang) {
  const relativePath = path === "" || path.startsWith("/") ? path : `/${path}`;
  const langPrefix = language === Lang.be ? "" : `/${language}`;

  return <link rel="canonical" key="link-canonical" href={`${seo.siteUrl[Lang.be]}${langPrefix}${relativePath}`} />;
}

function renderAlternateLinks(path: string) {
  const relativePath = path === "" || path.startsWith("/") ? path : `/${path}`;

  return (
    <>
      <link rel="alternate" key="link-alternate-be" hrefLang="be" href={`${seo.siteUrl[Lang.be]}${relativePath}`} />
      <link rel="alternate" key="link-alternate-nl" hrefLang="nl" href={`${seo.siteUrl[Lang.nl]}${relativePath}`} />
      <link rel="alternate" key="link-alternate-ru" hrefLang="ru" href={`${seo.siteUrl[Lang.ru]}${relativePath}`} />
    </>
  );
}

export const Head = (props: Partial<HeadProps>): JSX.Element => {
  const currentLanguage = props.lang ?? Lang.be;
  let imageUrl = seo.imageUrl;
  if (props.imagePath) {
    imageUrl = `${seo.siteUrl[currentLanguage]}${props.imagePath}`;
  }

  const { asPath } = useRouter();

  const url = `${seo.siteUrl[currentLanguage]}${asPath}`;

  return (
    <NextHead>
      <title>{props.title ?? seo.title[currentLanguage]}</title>

      {renderCanonicalLink(asPath, currentLanguage)}
      {renderAlternateLinks(asPath)}

      <meta
        name="keywords"
        content="mara belarus, mara nederland, mara wit-rusland, mara diaspora, belarus diaspora nederland"
      />
      <meta name="robots" content="index, follow" />

      <meta name="description" content={props.description ?? seo.description[currentLanguage]} key="meta-description" />
      <meta name="image" content={imageUrl} key="meta-image" />

      <meta property="og:url" content={url} key="meta-og:url" />
      <meta property="og:title" key="meta-og:title" content={props.title ?? seo.title[currentLanguage]} />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        key="meta-og:description"
        content={props.description ?? seo.description[currentLanguage]}
      />
      <meta property="og:image" key="meta-og:image" content={imageUrl} />
      <meta property="og:site_name" key="meta-og:site_name" content={seo.siteName} />
      <meta property="og:image:height" content="301" />
      <meta property="og:image:width" content="574" />
      <meta property="og:locale" content={langToLocale[currentLanguage]} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" key="meta-twitter:domain" content={seo.domain} />
      <meta property="twitter:url" key="meta-twitter:url" content={url} />
      <meta name="twitter:title" key="meta-twitter:title" content={props.title ?? seo.title[currentLanguage]} />
      <meta
        name="twitter:description"
        key="meta-twitter:description"
        content={props.description ?? seo.description[currentLanguage]}
      />
      <meta name="twitter:image" key="meta-twitter:image" content={imageUrl} />
    </NextHead>
  );
};
