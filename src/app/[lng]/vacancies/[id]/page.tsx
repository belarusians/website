import { Fragment } from "react";
import { Metadata, ResolvingMetadata } from "next/types";

import { Lang } from "../../../../components/types";
import { Section } from "../../../../components/section/section";
import H1 from "../../../../components/headinds/h1";
import { CommonPageParams } from "../../../types";
import VacancyForm from "./form";
import { getVacanciesByLang, getVacancyById } from "../../../../../sanity/lib/vacancy";

type VacancyPageParams = CommonPageParams & { params: { id: string } };

export default async function VacancyPage({ params }: VacancyPageParams) {
  const vacancy = await getVacancyById(params.lng, params.id);

  if (!vacancy) {
    return <h1>404</h1>;
  }

  return (
    <Section>
      <div className="rounded-md shadow-xl bg-white font-light text-black p-4 md:p-8">
        <H1 className="mb-4 md:mb-8">{vacancy.title}</H1>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-2 gap-y-2 md:gap-y-3 mb-8">
          {vacancy.tasks.map((task, i) => (
            <Fragment key={i}>
              <div className="col-span-1 text-red break-words font-medium basis-1">{task.title}</div>
              <div className="col-span-5">{task.description}</div>
            </Fragment>
          ))}
        </div>
        <div className="flex flex-col justify-items-start gap-2">
          <VacancyForm vacancyId={vacancy.id.current} lang={params.lng} />
        </div>
      </div>
    </Section>
  );
}

export async function generateMetadata({ params }: VacancyPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  const vacancy = await getVacancyById(params.lng, params.id);

  return {
    title: vacancy?.title || undefined,
    description: vacancy?.description || undefined,
    alternates: {
      canonical: `${parentMetadata.metadataBase}${Lang.be}/vacancies/${params.id}`,
      languages: {
        [Lang.be]: `${parentMetadata.metadataBase}${Lang.be}/vacancies/${params.id}`,
        [Lang.nl]: `${parentMetadata.metadataBase}${Lang.nl}/vacancies/${params.id}`,
        [Lang.ru]: `${parentMetadata.metadataBase}${Lang.ru}/vacancies/${params.id}`,
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title: vacancy?.title || undefined,
      description: vacancy?.description || undefined,
      url: `${params.lng}/vacancies/${params.id}`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title: vacancy?.title || undefined,
      description: vacancy?.description || undefined,
    },
  };
}

export async function generateStaticParams({ params }: CommonPageParams) {
  return (await getVacanciesByLang(params.lng)).map((vacancy) => ({ id: vacancy.id.current }));
}
