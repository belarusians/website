const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
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
      {
        source: "/nl/news/kupalle-2023-2",
        destination: "/nl/events/kupalle-2023-2",
        permanent: true,
      },
      {
        source: "/be/news/kupalle-2023-2",
        destination: "/be/events/kupalle-2023-2",
        permanent: true,
      },
      {
        source: "/ru/news/kupalle-2023-2",
        destination: "/ru/events/kupalle-2023-2",
        permanent: true,
      },
      {
        source: "/news/kupalle-2023-2",
        destination: "/be/events/kupalle-2023-2",
        permanent: true,
      },
      {
        source: "/targets",
        destination: "/be/targets",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
