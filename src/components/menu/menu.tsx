import Link from "next/link";
import * as React from "react";
import { useTranslation } from "next-i18next";

import { aboutUs, menu, menuList, languageSelector } from "./menu.css";
import { removeUnderline } from "../styles.css";
import { LanguageSelector } from "../language-selector/language-selector";

export function Menu(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={menu}>
      <ul className={menuList}>
        <li className={aboutUs}>
          <Link className={removeUnderline} href={"/about-us"}>
            {t("about-us")}
          </Link>
        </li>
      </ul>

      <LanguageSelector className={languageSelector} />
    </div>
  );
}
