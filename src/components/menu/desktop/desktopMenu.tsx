import { useTranslation } from "next-i18next";
import Link from "next/link";

import { menu, menuList } from "../menu.css";
import { LanguageSelector } from "../../language-selector/language-selector";
import { languageSelector, menuItem } from "./desktop-menu.css";

export function DesktopMenu(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={menu}>
      <div className={menuList}>
        <Link className={menuItem} href={"/join-us"}>
          {t("join-us")}
        </Link>
        <Link className={menuItem} href={"/about-us"}>
          {t("about-us")}
        </Link>
      </div>

      <LanguageSelector className={languageSelector} />
    </div>
  );
}
