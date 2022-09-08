import { section } from "./section.css";
import * as React from "react";

export function Section(props: React.PropsWithChildren): JSX.Element {
  return (
    <div className={section}>
      { props.children }
    </div>
  );
}