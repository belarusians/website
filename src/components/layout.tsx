import * as React from "react";

import { Header } from "./header/header";
import { Footer } from "./footer/footer";

import { container } from "./styles.css";

export function Layout(props: React.PropsWithChildren): JSX.Element {
  return (
    <>
      <Header className={container} />
      {props.children}
      <Footer className={container} />
    </>
  );
}

