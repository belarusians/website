import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";

import {
  hamburgerLines,
  joinUsButton,
  line1,
  line2,
  menu,
  menuItem,
  menuList,
  openedLine1,
  openedLine2,
} from "./mobile-menu.css";
import { LanguageSelector } from "../../language-selector/language-selector";
import { BeautifulButton } from "../../beautiful-button/beatiful-button";

export function MobileMenu(): JSX.Element {
  const [menuOpened, toggleMenuState] = useState(false);
  const { t } = useTranslation();

  function toggleMenu(): void {
    if (!firstLine.current || !secondLine.current) {
      return;
    }

    toggleMenuState(!menuOpened);

    if (menuOpened) {
      firstLine.current.className = line1;
      secondLine.current.className = line2;
    } else {
      firstLine.current.className = openedLine1;
      secondLine.current.className = openedLine2;
    }
  }

  const firstLine = useRef<HTMLSpanElement>(null);
  const secondLine = useRef<HTMLSpanElement>(null);

  return (
    <div className={menu}>
      <BeautifulButton className={joinUsButton} label={t("join-us")} link={"/join-us"} />

      <div className={hamburgerLines} onClick={toggleMenu}>
        <span ref={firstLine} className={line1}></span>
        <span ref={secondLine} className={line2}></span>
      </div>
      {menuOpened ? <OpenedMenu /> : null}
    </div>
  );
}

function OpenedMenu(): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className={menuList}>
      <LanguageSelector className={menuItem} />
      <Link className={menuItem} href={"/about-us"}>
        {t("about-us")}
      </Link>
      <Link className={menuItem} href={"https://bunq.me/VerenigingMARA"}>
        {t("donate-us")}
      </Link>
    </div>
  );
}
