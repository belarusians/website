import * as React from "react";
import { HTMLAttributes } from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Trans } from "react-i18next";

import { header, image, languageSelector, title } from "./header.css";
import { LanguageSelector } from "../language-selector/language-selector";

export function Header(props: HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <header className={props.className + " " + header}>
      <StaticImage className={image} src="../../images/logo.jpeg" alt="Belarusians NL logo" />
      <p className={title}>
        <Trans>title</Trans>
      </p>
      <LanguageSelector className={languageSelector} />
    </header>
  );
}
