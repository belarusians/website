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
      <div className="flex flex-col justify-between min-h-screen bg-white-shade">
        <Header className="lg:container" />
        <main className="mb-auto">{props.children}</main>
        <Footer className="lg:container" />
      </div>
    </>
  );
}
