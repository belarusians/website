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
      {
        source: "/events/kupalle-2023-3",
        destination: "/events/kupalle-2023-2",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);
