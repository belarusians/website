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
      // very old
      {
        source: "/news/navi-band-5-11-2022",
        destination: "/events/navi-band-5-11-2022",
        permanent: true,
      },
      {
        source: "/nl/news/navi-band-5-11-2022",
        destination: "/nl/events/navi-band-5-11-2022",
        permanent: true,
      },
      {
        source: "/be/news/navi-band-5-11-2022",
        destination: "/be/events/navi-band-5-11-2022",
        permanent: true,
      },
      {
        source: "/ru/news/navi-band-5-11-2022",
        destination: "/ru/events/navi-band-5-11-2022",
        permanent: true,
      },
      {
        source: "/news/rsp-03-25",
        destination: "/events/rsp-03-25",
        permanent: true,
      },
      {
        source: "/be/news/rsp-03-25",
        destination: "/be/events/rsp-03-25",
        permanent: true,
      },
      {
        source: "/ru/news/rsp-03-25",
        destination: "/ru/events/rsp-03-25",
        permanent: true,
      },
      {
        source: "/nl/news/rsp-03-25",
        destination: "/nl/events/rsp-03-25",
        permanent: true,
      },
      // since 12-06-2023
      {
        source: "/events/kupalle-2023-3",
        destination: "/be/events/kupalle-2023-2",
        permanent: true,
      },
      // since 26-06-2023
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
    ];
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
