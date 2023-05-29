import * as React from "react";
import Link from "next/link";

import { Logo } from "./logo";
import { Menu } from "../menu/menu";

export function Header(props: { className: string }): JSX.Element {
  return (
    <div
      className={
        props.className + " sticky md:static flex items-center bg-red md:bg-white py-2 md:py-4 lg:py-8 top-0 z-50"
      }
    >
      <Link href={"/"} passHref>
        <div className="flex">
          <Logo className="w-36 md:w-56 lg:w-72 xl:w-80" />
        </div>
      </Link>
      <Menu className="ml-auto" />
    </div>
  );
}
