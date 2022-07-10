import * as React from "react";
import { HTMLAttributes } from "react";
import { StaticImage } from "gatsby-plugin-image";

import { header, image, languageSelector } from "./header.css";
import { LanguageSelector } from "../language-selector/language-selector";

export function Header(props: HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <header className={props.className + " " + header}>
      <StaticImage
        className={image}
        src="../../images/logo.svg"
        alt="Belarusians NL logo"
      />
      <p>MARA</p>
      <LanguageSelector className={languageSelector} />
    </header>
  );
}
