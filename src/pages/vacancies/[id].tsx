import * as React from "react";
import { useState } from "react";
import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getVacancies, Vacancy } from "../../lib/vacancies";
import { CommonPageProps, Lang } from "../../components/types";
import { Section } from "../../components/section/section";
import H1 from "../../components/headinds/h1";
import { Head } from "../../components/head/head";
import { useTranslation } from "next-i18next";
import H3 from "../../components/headinds/h3";

interface VacancyPageProps extends CommonPageProps {
  vacancy?: Vacancy;
}

export default function VacancyPage({ vacancy, lang }: VacancyPageProps): React.JSX.Element {
  const { t } = useTranslation("vacancies");
  const [formContact, setFormContact] = useState("");
  const [formAdditional, setFormAdditional] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!vacancy) {
    return <h1>404</h1>;
  }

  function submit() {
    if (!formContact || !vacancy?.id) {
      setIsValid(false);
      return;
    }

    setIsValid(true);

    fetch("/api/vacancies/apply", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ contact: formContact, additional: formAdditional, id: vacancy.id }),
    }).then((response) => {
      if (!response.ok) {
        setIsValid(false);
        setIsSuccess(false);
      } else {
        setIsSuccess(true);
      }
    });
  }

  return (
    <>
      <Head lang={lang} title={vacancy.title} description={vacancy.description} imagePath="/abstract/ribbons.jpg" />
      <Section>
        <div className="rounded-md shadow-xl bg-white font-light text-black p-4 md:p-8">
          <H1 className="mb-4 md:mb-8">{vacancy.title}</H1>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-2 gap-y-2 md:gap-y-3 mb-8">
            {vacancy.tasks.map((task, i) => (
              <React.Fragment key={i}>
                <div className="col-span-1 text-red break-words font-medium basis-1">{task.title}</div>
                <div className="col-span-5">{task.description}</div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-col justify-items-start gap-2">
            <H3>{t("feedback-form-title")}</H3>
            {isSuccess ? (
              <span>{t("feedback-form-success")}</span>
            ) : (
              <>
                <label>
                  <span>{t("feedback-form-contact")}</span>
                  <span className="text-red"> *</span>
                  <input
                    onChange={(event) => setFormContact(event.target.value)}
                    type="text"
                    className={`transition-all w-full rounded-md border-light-grey focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20 ${
                      isValid ? "border-light-grey" : "border-red animate-shake"
                    }`}
                  />
                </label>
                <label>
                  <span>{t("feedback-form-additional")}</span>
                  <textarea
                    onChange={(event) => setFormAdditional(event.target.value)}
                    className="transition-all w-full rounded-md border-light-grey focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
                  />
                </label>
                <button
                  className="transition-all self-start p-2 lg:px-3 rounded-md border border-light-grey focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
                  onClick={submit}
                >
                  {t("feedback-form-button")}
                </button>
              </>
            )}
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
      ...(await serverSideTranslations(locale || "be", ["common", "vacancies"])),
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
