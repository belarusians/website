import * as React from "react";
import Link from "next/link";
import { Trans } from "next-i18next";

import { header, logo, logoContainer, languageSelector, logoText, logoDescription, logoTextContainer } from "./header.css";
import { LanguageSelector } from "../language-selector/language-selector";
import { Logo } from "./logo";
import { removeUnderline } from "../styles.css";

export function Header(props: { className: string, }): JSX.Element {
  return (
    <div className={props.className + " " + header}>
      <Link href={"/"}>
        <a className={removeUnderline}>
          <div className={logoContainer}>
            <Logo className={logo} />
            <div className={logoTextContainer}>
              <span className={logoText}>mára</span>
              <span className={logoDescription}>
                <Trans>logo-description</Trans>
              </span>
            </div>
          </div>
        </a>
      </Link>
      <LanguageSelector className={languageSelector} />
    </div>
  );
}
