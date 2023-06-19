import { MetadataRoute } from "next";

import { getNewsSlugs, getEventsSlugs } from "../lib/fs";
import { Lang } from "../components/types";
import { baseUrl } from "./config.";
import { getVacancies } from "../lib/vacancies";

function generateTranslatedUrls(path: string): MetadataRoute.Sitemap {
  const normalizedPath = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;

  return [
    {
      url: `${baseUrl}${Lang.be}${normalizedPath}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}${Lang.nl}${normalizedPath}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}${Lang.ru}${normalizedPath}`,
      lastModified: new Date(),
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const news = getNewsSlugs();
  const events = getEventsSlugs();
  const vacancies = getVacancies(Lang.be);

  const newsUrls: MetadataRoute.Sitemap = news.reduce((acc, slug) => {
    acc.push(...generateTranslatedUrls(`/news/${slug}`));
    return acc;
  }, [] as MetadataRoute.Sitemap);
  const eventsUrls: MetadataRoute.Sitemap = events.reduce((acc, slug) => {
    acc.push(...generateTranslatedUrls(`/events/${slug}`));
    return acc;
  }, [] as MetadataRoute.Sitemap);
  const vacanciesUrls: MetadataRoute.Sitemap = vacancies.reduce((acc, vacancy) => {
    acc.push(...generateTranslatedUrls(`/vacancies/${vacancy.id}`));
    return acc;
  }, [] as MetadataRoute.Sitemap);

  return [
    ...generateTranslatedUrls(""),
    ...generateTranslatedUrls("/join-us"),
    ...generateTranslatedUrls("/about-us"),
    ...generateTranslatedUrls("/targets"),
    ...generateTranslatedUrls("/vacancies"),
    ...newsUrls,
    ...eventsUrls,
    ...vacanciesUrls,
  ];
}
