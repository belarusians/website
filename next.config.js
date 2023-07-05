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
