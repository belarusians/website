const { i18n } = require("./next-i18next.config");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: true,
});

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/news/navi-band-5-11-2022",
        destination: "/events/navi-band-5-11-2022",
        permanent: true,
      },
      {
        source: "/news/rsp-03-25",
        destination: "/events/rsp-03-25",
        permanent: true,
      },
    ];
  },
  i18n,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);
