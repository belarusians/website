import { useTranslation } from "next-i18next";
import Link from "next/link";

import { LanguageSelector } from "../../language-selector/language-selector";
import { BeautifulButton } from "../../beautiful-button/beautiful-button";

export function DesktopMenu(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex items-center text-red gap-4">
      <BeautifulButton className="font-normal" trackingName="join-button" label={t("join-us")} link={"/join-us"} />

      <div className="divide-solid divide-red divide-x">
        <Link className="pr-2" href={"/about-us"}>
          {t("about-us")}
        </Link>
        <Link className="pl-2" data-umami-event="donate-us" target="_blank" href={"https://bunq.me/VerenigingMARA"}>
          {t("donate-us")}
        </Link>
      </div>

      <LanguageSelector />
    </div>
  );
}
