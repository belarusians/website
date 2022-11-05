import * as React from "react";
import Link from "next/link";

import { header, logo, logoContainer, languageSelector, aboutUs } from "./header.css";
import { LanguageSelector } from "../language-selector/language-selector";
import { Logo } from "./logo";
import { removeUnderline } from "../styles.css";
import { useTranslation } from "next-i18next";

export function Header(props: { className: string, }): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={props.className + " " + header}>
      <Link href={"/"}>
        <a className={removeUnderline}>
          <div className={logoContainer}>
            <Logo className={logo} />
          </div>
        </a>
      </Link>
      <Link href={"/about-us"}>
        <a className={removeUnderline}>
          <span className={aboutUs}>
            {t("about-us")}
          </span>
        </a>
      </Link>
      <LanguageSelector className={languageSelector} />
    </div>
  );
}
