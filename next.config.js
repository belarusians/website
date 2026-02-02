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
      // since 11-07-2024
      {
        source: "/events/Charnuha&Plotka",
        destination: "/events/charnuha-and-plotka",
        permanent: true,
      },
      {
        source: "/be/events/Charnuha&Plotka",
        destination: "/be/events/charnuha-and-plotka",
        permanent: true,
      },
      {
        source: "/nl/events/Charnuha&Plotka",
        destination: "/nl/events/charnuha-and-plotka",
        permanent: true,
      },
      // since 20-07-2024
      {
        source: "/nl/news/guk_viasny",
        destination: "/nl/news/guk-viasny",
        permanent: true,
      },
      {
        source: "/be/news/guk_viasny",
        destination: "/be/news/guk-viasny",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
