const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: Next.js, Clerk, Stripe, Umami
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.belarusians.nl https://*.clerk.accounts.dev https://js.stripe.com https://analytics.belarusians.nl https://analytics.umami.is https://cloud.umami.is",
      // Styles: Next.js inline styles + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self, Sanity CDN, data URIs
      "img-src 'self' data: https://cdn.sanity.io",
      // Frames: Stripe, Google Forms, status badge
      "frame-src https://js.stripe.com https://docs.google.com https://status.belarusians.nl",
      // Connections: Sanity API, Clerk, Stripe, ClickMeeting, Umami
      "connect-src 'self' https://*.sanity.io https://clerk.belarusians.nl https://*.clerk.accounts.dev https://api.stripe.com https://analytics.belarusians.nl https://analytics.umami.is https://cloud.umami.is",
      // Workers: Clerk uses service workers
      "worker-src 'self' blob:",
    ].join('; '),
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
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
      // since 17-02-2026
      {
        source: "/:lang(be|nl)/report-2025",
        destination: "/:lang/reports/2025",
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
