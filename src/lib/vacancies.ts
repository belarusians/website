import { Lang } from "../components/types";
import vacancies from "../../data/vacancies.json";

export interface VacancyApplication {
  id: string;
  contact: string;
  additionalInfo?: string;
}

interface VacancyMeta {
  title: string;
  description: string;
  tasks: { title: string; description: string }[];
}

type VacancyTranslations = {
  [lang in Lang]: VacancyMeta;
};

interface VacancyData extends VacancyTranslations {
  id: string;
}

export interface Vacancy extends VacancyMeta {
  id: string;
}

export function getVacancies(lang: Lang): Vacancy[] {
  return (vacancies as VacancyData[]).map((vacancy) => ({
    id: vacancy.id,
    ...vacancy[lang],
  }));
}
