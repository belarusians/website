import { getNewsSlugs } from "../lib/news";
import { GetServerSidePropsContext } from "next";
import { Lang } from "../components/types";

function generateSiteMap(newsSlugs: string[]) {
  const newsUrls = newsSlugs
    .map(
      (slug) => `
       <url>
           <loc>https://www.belarusians.nl/news/${slug}</loc>
       </url>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://www.belarusians.nl</loc>
     </url>
     <url>
       <loc>https://www.belarusians.nl/join-us</loc>
     </url>
     <url>
       <loc>https://www.belarusians.nl/about-us</loc>
     </url>
     <url>
       <loc>https://www.belarusians.nl/targets</loc>
     </url>
     ${newsUrls}
   </urlset>
 `;
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

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
