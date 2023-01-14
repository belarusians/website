import { useTranslation } from "next-i18next";
import Link from "next/link";

import { menu, menuList } from "../menu.css";
import { LanguageSelector } from "../../language-selector/language-selector";
import { joinUsButton, languageSelector, menuItem } from "./desktop-menu.css";
import { BeautifulButton } from "../../beautiful-button/beatiful-button";

export function DesktopMenu(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={menu}>
      <BeautifulButton className={joinUsButton} label={t("join-us")} link={"/join-us"} />

      <div className={menuList}>
        <Link className={menuItem} href={"/about-us"}>
          {t("about-us")}
        </Link>
      </div>

      <LanguageSelector className={languageSelector} />
    </div>
  );
}
