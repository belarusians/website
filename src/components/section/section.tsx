import * as React from "react";
import { section } from "./section.css";

export function Section(props: React.PropsWithChildren & { className?: string }): JSX.Element {
  return (
    <div className={`${section} ${props.className || ""}`}>
      <div className="lg:container px-3">{props.children}</div>
    </div>
  );
}
