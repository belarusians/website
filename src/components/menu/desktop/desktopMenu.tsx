"use client";

import Link from "next/link";

import { useTranslation } from "../../../app/i18n/client";
import { LanguageSelector } from "../../language-selector/language-selector";
import { Lang } from "../../types";

export function DesktopMenu({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang);

  return (
    <div className="flex items-center text-red gap-4 justify-between">
      <div className="text-lg flex rounded-md text-white bg-white cursor-pointer shadow-lg divide-solid divide-light-grey divide-x animate-wobble-right">
        <Link className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-tbl-xl" href={`/${lang}/about-us`}>
          {t("about-us")}
        </Link>
        <Link className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-tb-xl" href={`/${lang}/vacancies`}>
          {t("vacancies")}
        </Link>
        <Link
          className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-tb-xl"
          data-umami-event="donate-us"
          target="_blank"
          href={`/${lang}/donate`}
        >
          {t("donate-us")}
        </Link>
        <Link
          className="p-1 md:p-2 lg:p-3 bg-[length:350%_100%] bg-beautiful-button font-normal rounded-r-md text-white transition-all hover:shadow-tbr-xl animate-bg-rotation-slow-wobble-right"
          data-umami-event="join-button"
          href={`/${lang}/join-us`}
        >
          {t("join-us")}
        </Link>
      </div>

      <LanguageSelector lang={lang} />
    </div>
  );
}
