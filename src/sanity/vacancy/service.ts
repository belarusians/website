import { Lang } from '../../components/types';
import { client } from '../client';
import { Vacancy } from './type';

export async function getAllVacancies(): Promise<Vacancy[]> {
  return client.fetch(`*[_type == "vacancy"]{
    "id": id.current,
  }`);
}

export async function getVacanciesByLang(lang: Lang): Promise<Vacancy[]> {
  return client.fetch(`*[_type == "vacancy"]{
    "id": id.current,
    "title": title.${lang},
    "description": description.${lang},
    tasks,
  }`);
}

export async function getVacancyById(lang: Lang, id: string): Promise<Vacancy | undefined> {
  return client.fetch(`*[_type == "vacancy" && id.current == "${id}"]{
    "id": id.current,
    "title": title.${lang},
    "description": description.${lang},
    tasks,
  }[0]`);
}
