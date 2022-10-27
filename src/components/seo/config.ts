const next = {
  title: "Mara NEXT",
  description: "Official website of Belarusian diaspora in the Netherlands - MARA",
  siteUrl: "https://next.belarusians.nl",
  imagePath: "/logo/og-image.jpg",
};

const prod = {
  title: "Mara",
  description: "Official website of Belarusian diaspora in the Netherlands - MARA",
  siteUrl: "https://belarusians.nl",
  imagePath: "/logo/og-image.jpg",
};

const configuration = process.env.APP_ENV === 'prod' ? prod : next;

export default configuration;
