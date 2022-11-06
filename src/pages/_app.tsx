import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { Analytics } from '@vercel/analytics/react';
import { themeClass } from "../components/styles.css";

/**
 * workaround for flickering FA icon
 * see https://github.com/FortAwesome/react-fontawesome/issues/234
 */
import { config } from '@fortawesome/fontawesome-svg-core'
import '../../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={themeClass}>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}

export default appWithTranslation(MyApp);
