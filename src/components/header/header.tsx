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
      <Link className={removeUnderline} href={"/"}>
        <div className={logoContainer}>
          <Logo className={logo} />
        </div>
      </Link>
      <Link className={removeUnderline} href={"/about-us"}>
        <span className={aboutUs}>
          {t("about-us")}
        </span>
      </Link>
      <LanguageSelector className={languageSelector} />
    </div>
  );
}
