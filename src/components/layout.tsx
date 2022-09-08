import * as React from "react";

import { Header } from "./header/header";
import { Footer } from "./footer/footer";

import { section } from "./layout.css";

export function Layout(props: React.PropsWithChildren): JSX.Element {
  return (
    <>
      <Header className={section} />
      <div className={section}>
        { props.children }
      </div>
      <Footer className={section} />
    </>
  );
}
