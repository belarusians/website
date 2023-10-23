import Link from "next/link";

import { useTranslation } from "../../i18n";
import { Lang } from "../../../components/types";
import { Section } from "../../../components/section/section";
import H1 from "../../../components/headings/h1";
import { VacancyPreview } from "./vacancy-preview";
import { CommonPageParams } from "../../types";
import { Metadata, ResolvingMetadata } from "next/types";
import { Vacancy } from "../../../../sanity.config";
import { getVacanciesByLang } from "../../../sanity/vacancy/service";

export const revalidate = 3600;

export default async function VacanciesPage({ params }: CommonPageParams) {
  const { t } = await useTranslation(params.lang, "vacancies");
  const vacancies = await getData(params.lang);

  return (
    <Section>
      {vacancies.length ? (
        <>
          <H1 className="mb-2 md:mb-8">{t("heading")}</H1>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vacancies.map((vacancy, i) => (
              <Link href={`/${params.lang}/vacancies/${vacancy.id.current}`} key={i}>
                <VacancyPreview vacancy={vacancy} buttonLabel={t("more-button")} />
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="text-lg">
          <span>{t("no-vacancies")}</span> <a href="mailto:mara@belarusians.nl">mara@belarusians.nl</a>
        </p>
      )}
    </Section>
  );
}

async function getData(lang: Lang): Promise<Vacancy[]> {
  return getVacanciesByLang(lang);
}

const titleLang = {
  be: "Мара шукае кадры!",
  nl: "Mara zoekt personeel!",
  ru: "Мара ищет кадры!",
};

const descriptionLang = {
  be: "Ты хочаш дапамагчы нашай Мары? Можа быць мы шукаем менавіта цябе! Глядзі нашыя вакансіі і пішы нам, калі знойдзеш нешта для сябе.",
  nl: "Wil jij onze Mara helpen? Misschien zijn wij wel op zoek naar jou! Bekijk onze vacatures en schrijf ons als je iets voor jezelf vindt.",
  ru: "Ты хочешь помочь нашей Маре? Может быть мы ищем именно тебя! Смотри наши вакансии и пиши нам, если найдёшь что-то для себя.",
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    title: titleLang[params.lang],
    description: descriptionLang[params.lang],
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/vacancies`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/vacancies`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/vacancies`,
        [Lang.ru]: `${parentMetadata.metadataBase}${Lang.ru}/vacancies`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: titleLang[params.lang],
      description: descriptionLang[params.lang],
      url: `${params.lang}/vacancies`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: titleLang[params.lang],
      description: descriptionLang[params.lang],
    },
  };
}
