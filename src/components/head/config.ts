import { Lang } from "../types";

export interface SEOConfiguration {
  title: string;
  description: {
    [locale in Lang]: string;
  };
  siteName: string;
  siteUrl: {
    [locale in Lang]: string;
  };
  domain: string;
  imageUrl: string;
}

const prod: SEOConfiguration = {
  title: "MARA",
  siteName: "MARA",
  description: {
    be: "Нідэрландская некамерцыйная арганізацыя беларусаў для беларусаў - MARA",
    nl: "Nederlandse non-profit organisatie van Belarussen voor Belarussen - MARA",
    ru: "Нидерланская некоммерческая организация беларусов для беларусов - MARA",
  },
  siteUrl: {
    be: "https://www.belarusians.nl",
    nl: "https://www.belarusians.nl/nl",
    ru: "https://www.belarusians.nl/ru",
  },
  domain: "belarusians.nl",
  imageUrl: "https://www.belarusians.nl/logo/og-image.jpg",
};

const preview: SEOConfiguration = {
  ...prod,
};

const configuration: SEOConfiguration = process.env.APP_ENV === "prod" ? prod : preview;

export default configuration;
