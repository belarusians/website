import { useRef, useEffect, PropsWithChildren, JSX } from "react";

import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { Head } from "./head/head";

import { animateOnIntersection } from "../utils/intersection-animation";
import { CommonPageProps } from "./types";

type LayoutProps = PropsWithChildren & CommonPageProps;

export function Layout(props: LayoutProps): JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    animateOnIntersection(root.current);
  });

  return (
    <div ref={root}>
      <Head lang={props.lang} />
      <Header className="lg:container px-3" />
      {props.children}
      <Footer className="lg:container px-3" />
    </div>
  );
}
