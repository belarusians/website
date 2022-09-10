import * as React from "react";
import { HTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trans } from "next-i18next";
// @ts-ignore
import logo from "../../../public/logo.jpeg";

import { header, image, languageSelector, title, titleHeading, titleDescription } from "./header.css";
import { LanguageSelector } from "../language-selector/language-selector";

export function Header(props: HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <div className={props.className + " " + header}>
      <Link href={'/'}>
        <a>
          <div className={image}>
            <Image height={739} width={1280} layout="responsive" src={logo} objectFit="cover" alt="Belarusians NL logo" />
          </div>
        </a>
      </Link>
      <div className={title}>
        <h3 className={titleHeading}>
          <Trans>title</Trans>
        </h3>
        <p className={titleDescription}>
          <Trans>description</Trans>
        </p>
      </div>
      <LanguageSelector className={languageSelector} />
    </div>
  );
}
