import * as React from "react";

import { Header } from "./header/header";
import { Footer } from "./footer/footer";

import { container, darkBackground } from "./styles.css";
import { Section } from "./section/section";

export function Layout(props: React.PropsWithChildren): JSX.Element {
  return (
    <>
      <Header className={container} />
      {props.children}
      <Section>
        <Footer />
      </Section>
    </>
  );
}

