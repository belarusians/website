import { GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { CommonPageProps, Lang } from "../../components/types";
import { Head } from "../../components/head/head";
import { Section } from "../../components/section/section";
import H1 from "../../components/headinds/h1";
import { getVacancies, Vacancy } from "../../lib/vacancies";
import { VacancyPreview } from "../../components/vacancy/vacancyPreview";

interface VacanciesPageProps extends CommonPageProps {
  vacancies: Vacancy[];
}

export default function VacanciesPage(props: VacanciesPageProps) {
  const { t } = useTranslation("vacancies");

  return (
    <>
      <Head
        lang={props.lang}
        title={t("meta-title") || undefined}
        description={t("meta-description") || undefined}
        imagePath="/news/heart.jpg"
      />
      <Section>
        {props.vacancies.length ? (
          <>
            <H1>{t("heading")}</H1>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {props.vacancies.map((vacancy, i) => (
                <Link href={`/vacancies/${vacancy.id}`} key={i}>
                  <VacancyPreview vacancy={vacancy} />
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
    </>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<VacanciesPageProps>> {
  const lang = context.locale as Lang;
  const vacancies = getVacancies(lang);

  return {
    props: {
      lang,
      vacancies,
      ...(await serverSideTranslations(context.locale as Lang, ["common", "vacancies"])),
    },
  };
}
