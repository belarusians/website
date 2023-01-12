import { useTranslation } from "next-i18next";
import { aboutUs, menu, menuItem, menuList } from "../menu.css";
import Link from "next/link";
import { LanguageSelector } from "../../language-selector/language-selector";
import * as React from "react";
import { languageSelector } from "./desktop-menu.css";

export function DesktopMenu(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={menu}>
      <div className={menuList}>
        <Link className={aboutUs} href={"/join-us"}>
          {t("join-us")}
        </Link>
        <Link className={aboutUs} href={"/about-us"}>
          {t("about-us")}
        </Link>
      </div>

      <LanguageSelector className={languageSelector} />
    </div>
  );
}
