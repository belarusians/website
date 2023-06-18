"use client";

import Link from "next/link";

import { useTranslation } from "../../../app/i18n/client";
import { LanguageSelector } from "../../language-selector/language-selector";
import { BeautifulButton } from "../../beautiful-button/beautiful-button";
import { Lang } from "../../types";

export function DesktopMenu({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang);

  return (
    <div className="flex items-center text-red gap-4">
      <BeautifulButton
        className="font-normal"
        trackingName="join-button"
        label={t("join-us")}
        link={`/${lang}/join-us`}
      />

      <div className="lg:text-lg divide-solid divide-red divide-x">
        <Link className="pr-3" href={`/${lang}/about-us`}>
          {t("about-us")}
        </Link>
        <Link className="px-3" href={`/${lang}/vacancies`}>
          {t("vacancies")}
        </Link>
        <Link className="pl-3" data-umami-event="donate-us" target="_blank" href={"https://bunq.me/VerenigingMARA"}>
          {t("donate-us")}
        </Link>
      </div>

      <LanguageSelector lang={lang} />
    </div>
  );
}
