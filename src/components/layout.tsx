import * as React from "react";

import { Header } from "./header/header";
import { Footer } from "./footer";
import { section } from "./layout.css";

export function Layout(): JSX.Element {
  return (
    <>
      <Header className={section} />
      <section className={section}>
        <input type="text" />
      </section>
      <Footer className={section} />
    </>
  );
}
