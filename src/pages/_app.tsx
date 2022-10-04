import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { themeClass } from "../components/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={themeClass}>
      <Component {...pageProps} />
    </div>
  );
}

export default appWithTranslation(MyApp);
