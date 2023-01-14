import * as React from "react";
import Link from "next/link";

import { header, logo, logoContainer } from "./header.css";
import { Logo } from "./logo";
import { flexToRight } from "../common.styles.css";
import { Menu } from "../menu/menu";

export function Header(props: { className: string }): JSX.Element {
  return (
    <div className={props.className + " " + header}>
      <Link href={"/"} passHref>
        <div className={logoContainer}>
          <Logo className={logo} />
        </div>
      </Link>
      <Menu className={flexToRight} />
    </div>
  );
}
