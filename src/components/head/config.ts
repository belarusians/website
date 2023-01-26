import { Lang } from "../types";

export interface SEOConfiguration {
  title: {
    [locale in Lang]: string;
  };
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
  title: {
    be: "Аб'яднанне беларусаў у Нідэрландах",
    nl: "Vereniging Belarussen in Nederland",
    ru: "Объединение беларусов в Нидерландах",
  },
  siteName: "MÁRA",
  description: {
    be: "Некамерцыйная арганізацыя беларусаў Нідэрландаў - MÁRA",
    nl: "Een non-profit organisatie van Belarussen in Nederland - MÁRA",
    ru: "Некоммерческая организация беларусов в Нидерландах - MÁRA",
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
