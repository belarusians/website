interface SEOConfiguration {
  title: string;
  description: string;
  siteUrl: string;
  domain: string;
  imagePath: string;
}

const next: SEOConfiguration = {
  title: "Mara NEXT",
  description: "Official website of Belarusian diaspora in the Netherlands - MARA",
  siteUrl: "https://next.belarusians.nl",
  domain: "next.belarusians.nl",
  imagePath: "/logo/og-image.jpg",
};

const prod: SEOConfiguration = {
  title: "Mara",
  description: "Official website of Belarusian diaspora in the Netherlands - MARA",
  siteUrl: "https://belarusians.nl",
  domain: "belarusians.nl",
  imagePath: "/logo/og-image.jpg",
};

const configuration: SEOConfiguration = process.env.APP_ENV === 'prod' ? prod : next;

export default configuration;
