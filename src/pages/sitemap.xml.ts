import { getNewsSlugs } from "../lib/news";
import { GetServerSidePropsContext } from "next";
import { Lang } from "../components/types";

function generateTranslatedUrls(path: string): string {
  const relativePath = path.startsWith("/") ? path.slice(1) : path;
  return `<url>
            <loc>https://www.belarusians.nl/${relativePath}</loc>
            <xhtml:link rel="alternate" hreflang="be" href="https://www.belarusians.nl/${relativePath}"/>
            <xhtml:link rel="alternate" hreflang="nl" href="https://www.belarusians.nl/nl/${relativePath}"/>
            <xhtml:link rel="alternate" hreflang="ru" href="https://www.belarusians.nl/ru/${relativePath}"/>
          </url>
          <url>
            <loc>https://www.belarusians.nl/nl/${relativePath}</loc>
            <xhtml:link rel="alternate" hreflang="be" href="https://www.belarusians.nl/${relativePath}"/>
            <xhtml:link rel="alternate" hreflang="nl" href="https://www.belarusians.nl/nl/${relativePath}"/>
            <xhtml:link rel="alternate" hreflang="ru" href="https://www.belarusians.nl/ru/${relativePath}"/>
          </url>
          <url>
            <loc>https://www.belarusians.nl/ru/${relativePath}</loc>
            <xhtml:link rel="alternate" hreflang="be" href="https://www.belarusians.nl/${relativePath}"/>
            <xhtml:link rel="alternate" hreflang="nl" href="https://www.belarusians.nl/nl/${relativePath}"/>
            <xhtml:link rel="alternate" hreflang="ru" href="https://www.belarusians.nl/ru/${relativePath}"/>
          </url>`;
}

function generateSiteMap(newsSlugs: string[]) {
  const newsUrls = newsSlugs.map((slug) => generateTranslatedUrls(`/news/${slug}`)).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              ${generateTranslatedUrls("")}
              ${generateTranslatedUrls("/join-us")}
              ${generateTranslatedUrls("/about-us")}
              ${generateTranslatedUrls("/targets")}
              ${newsUrls}
            </urlset>`;
}

export default function SiteMap() {}

export async function getServerSideProps({ res, locale }: GetServerSidePropsContext) {
  const news = getNewsSlugs(locale as Lang);

  const sitemap = generateSiteMap(news);

  res.setHeader("Content-Type", "text/xml");

  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
