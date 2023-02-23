import { Roboto } from "@next/font/google";
import { AppProps } from "next/app";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { Analytics } from "@vercel/analytics/react";
import { themeClass } from "../components/styles.css";
import { Layout } from "../components/layout";

/**
 * workaround for flickering FA icon
 * see https://github.com/FortAwesome/react-fontawesome/issues/234
 */
import { config } from "@fortawesome/fontawesome-svg-core";
import "../../node_modules/@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const roboto = Roboto({
  weight: ["300", "400", "500", "900"],
  subsets: ["latin", "cyrillic"],
});

function MyApp({ Component, pageProps }: AppProps) {
  const className = themeClass + " " + roboto.className;
  const { lang } = pageProps;
  return (
    <>
      <Script
        async
        defer
        src="https://analytics.umami.is/script.js"
        data-website-id="d1f28365-f189-4d4c-bcea-17ee67c90f91"
        data-domains="www.belarusians.nl"
      />

      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-N72CH8S7K2" />
      <Script id="google-tag">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-N72CH8S7K2');`}
      </Script>

      <div className={className}>
        <Layout lang={lang}>
          <Component {...pageProps} />
        </Layout>
        <Analytics />
      </div>
    </>
  );
}

export default appWithTranslation(MyApp);
