import { useRef, useEffect, PropsWithChildren } from "react";

import { Header } from "./header/header";
import { Footer } from "./footer/footer";

import { container } from "./common.styles.css";
import { animateOnIntersection } from "../utils/intersection-animation";

export function Layout(props: PropsWithChildren): JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    animateOnIntersection(root.current);
  });
  return (
    <div ref={root}>
      <Header className={container} />
      {props.children}
      <Footer className={container} />
    </div>
  );
}
