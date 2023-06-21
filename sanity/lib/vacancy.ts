import { Lang } from "../../src/components/types";
import { client } from "./client";
import { Vacancy } from "../../sanity.config";

export async function getAllVacancies(): Promise<Vacancy[]> {
  return client.fetch('*[_type == "vacancy"]');
}

export async function getVacanciesByLang(lang: Lang): Promise<Vacancy[]> {
  return client.fetch(`*[_type == "vacancy" && language == "${lang}"]`);
}

export async function getVacancyById(lang: Lang, id: string): Promise<Vacancy | undefined> {
  return client.fetch(`*[_type == "vacancy" && id.current == "${id}" && language == "${lang}"][0]`);
}
