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
    be: "MARA: Аб'яднанне беларусаў у Нідэрландах",
    nl: "MARA: Vereniging Belarusen in Nederland",
    ru: "MARA: Объединение беларусов в Нидерландах",
  },
  siteName: "MÁRA",
  description: {
    be: "MARA - гэта некамерцыйная арганізацыя неабыякавых беларусаў Нідэрландаў, якія мараць аб цудоўнай будучыні для сваёй роднай краіны.",
    nl: "MARA is een non-profit organisatie van zorgzame Belarusen in Nederland die dromen van een mooie toekomst voor hun vaderland.",
    ru: "MARA - это некоммерческая организация небезразличных беларусов Нидерландов, которые мечтают о прекрасном будущем для своей родной страны.",
  },
  siteUrl: {
    be: "https://www.belarusians.nl",
    nl: "https://www.belarusians.nl/nl",
    ru: "https://www.belarusians.nl/ru",
  },
  domain: "belarusians.nl",
  imageUrl: "https://www.belarusians.nl/logo/og-image.png",
};

const preview: SEOConfiguration = {
  ...prod,
};

const configuration: SEOConfiguration = process.env.APP_ENV === "prod" ? prod : preview;

export default configuration;
