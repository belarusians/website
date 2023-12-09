import { MetadataRoute } from 'next';

import { Lang } from '../components/types';
import { baseUrl } from './config';
import { getVacanciesByLang } from '../sanity/vacancy/service';
import { getAllEventsSlugs } from '../sanity/event/service';
import { getAllNewsSlugs } from '../sanity/news/service';

export function generateTranslatedUrls(path: string): MetadataRoute.Sitemap {
  const normalizedPath = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`;

  return [
    {
      url: `${baseUrl}${Lang.be}${normalizedPath}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}${Lang.nl}${normalizedPath}`,
      lastModified: new Date(),
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getAllNewsSlugs(Lang.be);
  const events = await getAllEventsSlugs(Lang.be);
  const vacancies = await getVacanciesByLang(Lang.be);

  const newsUrls: MetadataRoute.Sitemap = news.reduce((acc, slug) => {
    acc.push(...generateTranslatedUrls(`/news/${encodeURIComponent(slug.slug)}`));
    return acc;
  }, [] as MetadataRoute.Sitemap);
  const eventsUrls: MetadataRoute.Sitemap = events.reduce((acc, slug) => {
    acc.push(...generateTranslatedUrls(`/events/${encodeURIComponent(slug.slug)}`));
    return acc;
  }, [] as MetadataRoute.Sitemap);
  const vacanciesUrls: MetadataRoute.Sitemap = vacancies.reduce((acc, vacancy) => {
    acc.push(...generateTranslatedUrls(`/vacancies/${encodeURIComponent(vacancy.id.current!)}`)); // TODO: find out why current could be undefined
    return acc;
  }, [] as MetadataRoute.Sitemap);

  return [
    ...generateTranslatedUrls(''),
    ...generateTranslatedUrls('/about-us'),
    ...generateTranslatedUrls('/donate'),
    ...generateTranslatedUrls('/join-us'),
    ...generateTranslatedUrls('/vacancies'),
    ...generateTranslatedUrls('/events'),
    ...newsUrls,
    ...eventsUrls,
    ...vacanciesUrls,
  ];
}
