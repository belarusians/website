import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { useI18next } from "gatsby-plugin-react-i18next";
// @ts-ignore
import logo from "../images/logo.jpeg";

export const SEO = (): JSX.Element => {
  const { site } = useStaticQuery(query)
  const seo = site.siteMetadata;
  const currentLanguage = useI18next().language;

  return (
    <Helmet title={seo.title} htmlAttributes={{
      lang: currentLanguage,
    }}>
      <meta name="google-site-verification" content="hXVTSewNsnJ2_HBXFikyt5I9HeaIv2QypVnUeqcJKvU" />
      <meta name="facebook-domain-verification" content="puzhrq5e71epeox7ohkx5oluv6azvd" />

      <meta name="description" content={seo.description} />
      <meta name="image" content={logo} />

      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={logo} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={logo} />
    </Helmet>
  )
}

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        title
        description
        url
      }
    }
  }
`
