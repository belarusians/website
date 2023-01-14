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
  siteUrl: "https://belarusians.nl",
  domain: "belarusians.nl",
  imagePath: "/logo/og-image.jpg",
};

const next: SEOConfiguration = {
  ...prod,
  title: "MARA NEXT",
  siteUrl: "https://next.belarusians.nl",
  domain: "next.belarusians.nl",
};


const configuration: SEOConfiguration = process.env.APP_ENV === "prod" ? prod : next;

export default configuration;
