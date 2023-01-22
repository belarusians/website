export interface SEOConfiguration {
  title: string;
  description: string;
  siteUrl: string;
  domain: string;
  imageUrl: string;
}

const prod: SEOConfiguration = {
  title: "MARA",
  description: "Нідэрландская некамерцыйная арганізацыя беларусаў для беларусаў - MARA",
  siteUrl: "https://www.belarusians.nl",
  domain: "belarusians.nl",
  imageUrl: "https://www.belarusians.nl/logo/og-image.jpg",
};

const preview: SEOConfiguration = {
  ...prod,
};

const configuration: SEOConfiguration = process.env.APP_ENV === "prod" ? prod : preview;

export default configuration;
