import type { GatsbyConfig } from "gatsby";

const siteUrl = "https://www.belarusians.nl";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "Mara - Belarusians NL",
    description:
      "Official website of Belarusian diaspora in the Netherlands - MARA",
    url: siteUrl,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-vanilla-extract",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-react-i18next",
      options: {
        languages: ["nl", "be", "ru"],
        defaultLanguage: "be",
        siteUrl, // for helmet
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-remark",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/locales`,
        name: "locale",
      },
      __key: "locale",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages/`,
      },
      __key: "pages",
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/favicon.png',
      },
    },
  ],
};

export default config;
