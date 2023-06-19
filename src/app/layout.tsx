import React, { PropsWithChildren } from "react";
import { Metadata } from "next/types";
import Script from "next/script";
import { Roboto } from "next/font/google";

import "../components/globals.css";

/**
 * workaround for flickering FA icon
 * see https://github.com/FortAwesome/react-fontawesome/issues/234
 */
import { config } from "@fortawesome/fontawesome-svg-core";
import "../../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
import { baseUrl } from "./config";
config.autoAddCss = false;

const roboto = Roboto({
  weight: ["300", "400", "500", "900"],
  subsets: ["latin", "cyrillic"],
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="manifest" href="/browserconfig.xml" />
        <link rel="mask-icon" type="image/svg+xml" href="/icons/safari-pinned-tab.svg" color="#ed1c24" />
      </head>
      <body>
        <Script
          async
          defer
          src="https://analytics.umami.is/script.js"
          data-website-id="d1f28365-f189-4d4c-bcea-17ee67c90f91"
          data-domains="www.belarusians.nl"
        />
        <div className={roboto.className}>{children}</div>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: baseUrl,
    keywords: ["mara belarus", "mara nederland", "mara wit-rusland", "mara diaspora", "belarus diaspora nederland"],
    themeColor: "#ed1c24",
    verification: {
      google: "hXVTSewNsnJ2_HBXFikyt5I9HeaIv2QypVnUeqcJKvU",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      siteName: "MÁRA",
      type: "website",
      images: [
        {
          url: "https://www.belarusians.nl/logo/og-image.png",
          width: 1076, // 574
          height: 568, // 301
        },
      ],
    },
    twitter: {
      images: ["https://www.belarusians.nl/logo/og-image.png"],
      card: "summary_large_image",
    },
    other: {
      "facebook-domain-verification": "puzhrq5e71epeox7ohkx5oluv6azvd",
      "fb:app_id": "1246176432634113",
      "msapplication-TileColor": "#b91d47",
    },
  };
}
