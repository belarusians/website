import * as React from "react";
import Link from "next/link";
import { useRef, useState } from "react";

import { header, logo, logoContainer, redBackground } from "./header.css";
import { Logo } from "./logo";
import { flexToRight } from "../common.styles.css";
import { Menu } from "../menu/menu";

export function Header(props: { className: string }): JSX.Element {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isWhite, makeLogoWhite] = useState(false);

  function toggleMenu(opened: boolean) {
    if (!headerRef.current) {
      return;
    }

    makeLogoWhite(opened);
    if (opened) {
      headerRef.current.classList.add(redBackground);
    } else {
      headerRef.current.classList.remove(redBackground);
    }
  }

  return (
    <div ref={headerRef} className={props.className + " " + header}>
      <Link href={"/"} passHref>
        <div className={logoContainer}>
          <Logo className={logo} isWhite={isWhite} />
        </div>
      </Link>
      <Menu className={flexToRight} onToggleMenu={toggleMenu} />
    </div>
  );
}
