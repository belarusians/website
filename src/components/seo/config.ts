import { Lang } from "../types";

interface SEOConfiguration {
  title: string;
  description: {
    [locale in Lang]: string;
  };
  siteUrl: string;
  domain: string;
  imagePath: string;
}

const prod: SEOConfiguration = {
  title: "MARA",
  description: {
    be: "Нідэрландская некамерцыйная арганізацыя беларусаў для беларусаў - MARA",
    nl: "Nederlandse non-profit organisatie van Belarussen voor Belarussen - MARA",
    ru: "Нидерланская некоммерческая организация беларусов для беларусов - MARA",
  },
  siteUrl: "https://www.belarusians.nl",
  domain: "belarusians.nl",
  imagePath: "/logo/og-image.jpg",
};

const preview: SEOConfiguration = {
  ...prod,
};

const configuration: SEOConfiguration = process.env.APP_ENV === "prod" ? prod : preview;

export default configuration;
