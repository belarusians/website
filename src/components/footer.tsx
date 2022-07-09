import * as React from "react";
import { HTMLAttributes } from "react";

export function Footer(props: HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <footer className={props.className}>
      <p>Belarusians NL 2022</p>
    </footer>
  );
}
