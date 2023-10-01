import Link from "next/link";

import { Logo } from "./logo";
import { Menu } from "../menu/menu";
import { Lang } from "../types";

export function Header(props: { className: string; lang: Lang }) {
  return (
    <header
      className={`sticky md:static flex items-center bg-red md:bg-white-shade px-3 py-2 md:py-4 lg:py-8 top-0 z-50 gap-4 lg:gap-8 ${props.className}`}
    >
      <Link href={`/${props.lang}`} passHref>
        <div className="flex">
          <Logo className="w-36 md:w-56 lg:w-72 xl:w-80" />
        </div>
      </Link>
      <Menu lang={props.lang} className="grow" />
    </header>
  );
}
