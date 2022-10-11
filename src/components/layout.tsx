import * as React from "react";

import { Header } from "./header/header";
import { Footer } from "./footer/footer";

import { Section } from "./section/section";
import { content } from "./styles.css";

export function Layout(props: React.PropsWithChildren): JSX.Element {
  return (
    <>
      <Section>
        <Header className={content} />
      </Section>
      {props.children}
      <Section>
        <Footer className={content} />
      </Section>
    </>
  );
}

