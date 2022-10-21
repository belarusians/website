import * as React from "react";
import Link from "next/link";

import { header, logo, logoContainer, languageSelector } from "./header.css";
import { LanguageSelector } from "../language-selector/language-selector";
import { Logo } from "./logo";
import { removeUnderline } from "../styles.css";

export function Header(props: { className: string, }): JSX.Element {
  return (
    <div className={props.className + " " + header}>
      <Link href={"/"}>
        <a className={removeUnderline}>
          <div className={logoContainer}>
            <Logo className={logo}/>
          </div>
        </a>
      </Link>
      <LanguageSelector className={languageSelector} />
    </div>
  );
}
