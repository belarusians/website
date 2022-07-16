import * as React from "react";

import { Header } from "./header/header";
import { Subscribe } from "./subscribe/subscribe";
import { Footer } from "./footer/footer";

import { section } from "./layout.css";
import { themeClass } from "./sprinkles.css";

export function Layout(): JSX.Element {
  return (
    <>
      <Header className={`${section} ${themeClass}`} />
      <Subscribe className={`${section} ${themeClass}`} />
      <Footer className={`${section} ${themeClass}`} />
    </>
  );
}
