import * as React from "react";
import { Trans } from "react-i18next";

import { Header } from "./header/header";
import { Footer } from "./footer";
import { section } from "./layout.css";

export function Layout(): JSX.Element {
  return (
    <>
      <Header className={section} />
      <section className={section}>
        <Trans>subscribe</Trans>
        <input type="text" />
      </section>
      <Footer className={section} />
    </>
  );
}
