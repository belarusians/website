import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import { LanguageSelector } from "../../language-selector/language-selector";
import { BeautifulButton } from "../../beautiful-button/beautiful-button";

export function MobileMenu(): JSX.Element {
  const { t } = useTranslation();
  const [menuOpened, toggleMenuState] = useState(false);

  return (
    <div className="flex items-center">
      <BeautifulButton className="mr-4" trackingName="join-button" label={t("join-us")} link={"/join-us"} />

      <div
        className="flex flex-col justify-between top-[17px] left-[20px] h-[24px] w-[32px] cursor-pointer z-40"
        onClick={() => toggleMenuState(!menuOpened)}
      >
        <span
          className={
            menuOpened
              ? "transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[6px_6px] rotate-45"
              : "transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[6px_6px]"
          }
        ></span>
        <span
          className={
            menuOpened
              ? "transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[5px_1px] -rotate-45"
              : "transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[5px_1px]"
          }
        ></span>
      </div>
      {menuOpened ? <OpenedMenu /> : null}
    </div>
  );
}

function OpenedMenu(): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="bg-red flex flex-col items-center w-full top-[56px] left-0 absolute z-40 divide-solid divide-white divide-y">
      <LanguageSelector className="text-white py-4" />
      <Link className="text-white py-4 text-xl" href={"/about-us"}>
        {t("about-us")}
      </Link>
      <Link target="_blank" className="text-white py-4 text-xl" href={"https://bunq.me/VerenigingMARA"}>
        {t("donate-us")}
      </Link>
    </div>
  );
}
