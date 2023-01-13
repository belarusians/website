import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";

import {
  hamburgerLines,
  line1,
  line2,
  line3,
  menuItem,
  menuList,
  openedLine1,
  openedLine2,
  openedLine3,
} from "./mobile-menu.css";
import { LanguageSelector } from "../../language-selector/language-selector";

export function MobileMenu(props: { className?: string; onToggleMenu: (opened: boolean) => void }): JSX.Element {
  const [menuOpened, toggleMenuState] = useState(false);

  function toggleMenu(): void {
    if (!firstLine.current || !secondLine.current || !thirdLine.current) {
      return;
    }

    toggleMenuState(!menuOpened);
    props.onToggleMenu(!menuOpened);

    if (menuOpened) {
      firstLine.current.className = line1;
      secondLine.current.className = line2;
      thirdLine.current.className = line3;
    } else {
      firstLine.current.className = openedLine1;
      secondLine.current.className = openedLine2;
      thirdLine.current.className = openedLine3;
    }
  }

  const firstLine = useRef<HTMLSpanElement>(null);
  const secondLine = useRef<HTMLSpanElement>(null);
  const thirdLine = useRef<HTMLSpanElement>(null);

  return (
    <>
      <div className={hamburgerLines} onClick={toggleMenu}>
        <span ref={firstLine} className={line1}></span>
        <span ref={secondLine} className={line2}></span>
        <span ref={thirdLine} className={line3}></span>
      </div>
      {menuOpened ? <OpenedMenu /> : null}
    </>
  );
}

function OpenedMenu(): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className={menuList}>
      <LanguageSelector className={menuItem} />
      <Link className={menuItem} href={"/join-us"}>
        {t("join-us")}
      </Link>
      <Link className={menuItem} href={"/about-us"}>
        {t("about-us")}
      </Link>
    </div>
  );
}
