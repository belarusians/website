"use client";

import { CommonPageParams } from "../../types";
import { useTranslation } from "../../i18n/client";
import { Section } from "../../../components/section/section";
import H1 from "../../../components/headings/h1";
import { useSearchParams } from "next/navigation";
import { DonateButtons } from "./donate-buttons";

export default function Page({ params }: CommonPageParams) {
  const searchParams = useSearchParams()
  const success = searchParams.has("success");

  const { t } = useTranslation(params.lng, "donate");

  return (
    <Section>
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-20 xl:gap-60">
        <div className="md:basis-1/2 lg:basis-2/3 xl:basis-3/5">
          <H1>{t("heading")}</H1>
          <p>
            {t("text")}
          </p>
        </div>
        <div className="md:basis-1/2 lg:basis-1/3 xl:basis-2/5 grid grid-cols-2 gap-4">
          { success ? <div className="col-span-2 h-100 rounded-md bg-white shadow-lg flex items-center justify-center">
            {t("successMsg")}
          </div> : <DonateButtons donateBtnLabel={t("donateBtn")}
                                  recurringLabel={t("recurring")}
                                  donateBtnErrLabel={t("donateBtnErr")}
          /> }
        </div>
      </div>
    </Section>
  );
}
