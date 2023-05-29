import { PropsWithChildren, JSX } from "react";

import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { Head } from "./head/head";

import { CommonPageProps } from "./types";

type LayoutProps = PropsWithChildren & CommonPageProps;

export function Layout(props: LayoutProps): JSX.Element {
  return (
    <>
      <Head lang={props.lang} />
      <Header className="lg:container px-3" />
      {props.children}
      <Footer className="lg:container px-3" />
    </>
  );
}
