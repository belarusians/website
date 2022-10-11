import * as React from "react";
import { section } from "./section.css";

export function Section(props: React.PropsWithChildren): JSX.Element {
  return <section className={section}>{props.children}</section>;
}
