import * as React from "react";
import { HTMLAttributes } from "react";
import { StaticImage } from "gatsby-plugin-image";

import { image } from "./header.css";

export function Header(props: HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <header className={props.className}>
      <StaticImage
        className={image}
        src="../../images/logo.svg"
        alt="Belarusians NL logo"
      />
    </header>
  );
}
