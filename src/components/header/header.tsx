import * as React from "react";
import { HTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trans } from "next-i18next";
// @ts-ignore
import logo from "../../../public/logo/logo.svg";

import { header, image, languageSelector, title, titleHeading, titleDescription } from "./header.css";
import { LanguageSelector } from "../language-selector/language-selector";

export function Header(props: HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <div className={props.className + " " + header}>
      <Link href={'/'}>
        <a>
          <div className={image}>
            <Image layout="responsive" src={logo} objectFit="cover" alt="Belarusians NL logo" />
          </div>
        </a>
      </Link>
      <LanguageSelector className={languageSelector} />
    </div>
  );
}
