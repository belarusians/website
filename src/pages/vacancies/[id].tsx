import * as React from "react";
import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getVacancies, Vacancy } from "../../lib/vacancies";
import { CommonPageProps, Lang } from "../../components/types";
import { Section } from "../../components/section/section";
import H1 from "../../components/headinds/h1";
import { Head } from "../../components/head/head";
import { useTranslation } from "next-i18next";

interface VacancyPageProps extends CommonPageProps {
  vacancy?: Vacancy;
}

export default function VacancyPage({ vacancy, lang }: VacancyPageProps): React.JSX.Element {
  const { t } = useTranslation("vacancies");

  if (!vacancy) {
    return <h1>404</h1>;
  }

  return (
    <>
      <Head
        lang={lang}
        title={t("meta-title") || undefined}
        description={t("meta-description") || undefined}
        imagePath="/abstract/ribbons.jpg"
      />
      <Section>
        <div className="rounded-md shadow-xl bg-white font-light text-black p-4 md:p-8">
          <H1 className="mb-4 md:mb-8">{vacancy.title}</H1>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-2 gap-y-2 md:gap-y-3 mb-3">
            {vacancy.tasks.map((task, i) => (
              <React.Fragment key={i}>
                <div className="col-span-1 text-red break-words font-medium basis-1">{task.title}</div>
                <div className="col-span-5">{task.description}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<VacancyPageProps>> {
  const lang = locale as Lang;

  if (!params) {
    return {
      props: {
        lang,
      },
    };
  }

  const vacancy = getVacancies(lang).find((vac) => vac.id === params.id);
  return {
    props: {
      lang,
      vacancy,
      ...(await serverSideTranslations(locale || "be", ["common"])),
    },
  };
}

type StaticPaths = { params: { id: string }; locale?: string }[];

export function getStaticPaths({ locales }: GetStaticPathsContext): GetStaticPathsResult<{ id: string }> {
  const paths = (locales as Lang[]).reduce((acc, lang) => {
    acc.push(...getVacancies(lang).map((vac) => ({ params: { id: vac.id }, locale: lang })));
    return acc;
  }, [] as StaticPaths);

  return {
    paths,
    fallback: false,
  };
}
