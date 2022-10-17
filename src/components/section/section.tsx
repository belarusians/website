import * as React from "react";
import { section } from "./section.css";
import { container } from "../styles.css";

export function Section(props: React.PropsWithChildren & { className?: string }): JSX.Element {
  return (
    <section className={`${section} ${props.className || ''}`}>
      <div className={container}>{props.children}</div>
    </section>
  );
}
