import { Roboto } from "next/font/google";
import { AppProps } from "next/app";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { themeClass } from "../components/styles.css";
import { Layout } from "../components/layout";
import "../components/globals.css";

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

const DISABLE_GOOGLE_TAG = true;

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
      {DISABLE_GOOGLE_TAG ? null : <GoogleTag />}

      <div className={className}>
        <Layout lang={lang}>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  );
}

export default appWithTranslation(MyApp);

function GoogleTag(): JSX.Element {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GFM2BXYZ27" />
      <Script id="google-tag">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-GFM2BXYZ27');`}
      </Script>
    </>
  );
}
