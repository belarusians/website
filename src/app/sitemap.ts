import { MetadataRoute } from 'next';

import { Lang } from '../components/types';
import { baseUrl } from './config';
import { getAllVacancies } from '../sanity/vacancy/service';
import { getAllEventsSlugs } from '../sanity/event/service';
import { getAllNewsSlugs } from '../sanity/news/service';
import { getAllGuidesSlugs } from '../sanity/guide/service';

export const BUILD_TIME = new Date();

export function generateTranslatedUrls(path: string): MetadataRoute.Sitemap {
  const normalizedPath = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`;

  return [
    {
      url: `${baseUrl}${Lang.be}${normalizedPath}`,
      lastModified: BUILD_TIME,
    },
    {
      url: `${baseUrl}${Lang.nl}${normalizedPath}`,
      lastModified: BUILD_TIME,
    },
  ];
}

export function generateDynamicTranslatedUrls(path: string, updatedAt?: string): MetadataRoute.Sitemap {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const lastModified = updatedAt ? new Date(updatedAt) : BUILD_TIME;

  return [
    {
      url: `${baseUrl}${Lang.be}${normalizedPath}`,
      lastModified,
    },
    {
      url: `${baseUrl}${Lang.nl}${normalizedPath}`,
      lastModified,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getAllNewsSlugs();
  const events = await getAllEventsSlugs();
  const vacancies = await getAllVacancies();
  const guides = await getAllGuidesSlugs();

  const newsUrls: MetadataRoute.Sitemap = news.reduce((acc, item) => {
    acc.push(...generateDynamicTranslatedUrls(`/news/${encodeURIComponent(item.slug)}`, item._updatedAt));
    return acc;
  }, [] as MetadataRoute.Sitemap);
  const eventsUrls: MetadataRoute.Sitemap = events.reduce((acc, item) => {
    acc.push(...generateDynamicTranslatedUrls(`/events/${encodeURIComponent(item.slug)}`, item._updatedAt));
    return acc;
  }, [] as MetadataRoute.Sitemap);
  const vacanciesUrls: MetadataRoute.Sitemap = vacancies.reduce((acc, vacancy) => {
    acc.push(...generateDynamicTranslatedUrls(`/vacancies/${encodeURIComponent(vacancy.id)}`, vacancy._updatedAt));
    return acc;
  }, [] as MetadataRoute.Sitemap);
  const guidesUrls: MetadataRoute.Sitemap = guides.reduce((acc, item) => {
    acc.push(...generateDynamicTranslatedUrls(`/guides/${encodeURIComponent(item.slug)}`, item._updatedAt));
    return acc;
  }, [] as MetadataRoute.Sitemap);

  return [
    ...generateTranslatedUrls(''),
    ...generateTranslatedUrls('/about-us'),
    ...generateTranslatedUrls('/donate'),
    ...generateTranslatedUrls('/join-us'),
    ...generateTranslatedUrls('/vacancies'),
    ...generateTranslatedUrls('/events'),
    ...generateTranslatedUrls('/news'),
    ...generateTranslatedUrls('/guides'),
    ...generateTranslatedUrls('/kupalle'),
    ...generateTranslatedUrls('/help'),
    ...generateTranslatedUrls('/alien-passport'),
    ...newsUrls,
    ...eventsUrls,
    ...vacanciesUrls,
    ...guidesUrls,
  ];
}
