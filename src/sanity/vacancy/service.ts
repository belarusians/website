import { Lang } from '../../components/types';
import { sanityFetch } from '../client';
import { Vacancy } from './type';

export async function getAllVacancies(): Promise<Vacancy[]> {
  return sanityFetch<Vacancy[]>(
    `*[_type == "vacancy"]{
    "id": id.current,
    _updatedAt,
  }`,
    ['vacancy'],
  );
}

export async function getVacanciesByLang(lang: Lang): Promise<Vacancy[]> {
  return sanityFetch<Vacancy[]>(
    `*[_type == "vacancy"]{
    "id": id.current,
    "title": title.${lang},
    "description": description.${lang},
    tasks,
  }`,
    ['vacancy'],
  );
}

export async function getVacancyById(lang: Lang, id: string): Promise<Vacancy | undefined> {
  return sanityFetch<Vacancy | undefined>(
    `*[_type == "vacancy" && id.current == $id]{
    "id": id.current,
    "title": title.${lang},
    "description": description.${lang},
    tasks,
    _createdAt,
    _updatedAt,
  }[0]`,
    ['vacancy'],
    { id },
  );
}
