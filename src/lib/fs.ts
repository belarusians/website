import path from "path";
import { promises as fsPromises, readdirSync } from "fs";

import { Lang } from "../components/types";

const newsDirectory = path.join(process.cwd(), "_news");
const ext = ".md";

export function getNewsSlugs(lang: Lang = Lang.be): string[] {
  const pathToNews = path.resolve(newsDirectory, lang);

  const newsFiles = readdirSync(pathToNews);
  return newsFiles.map((f) => f.substring(0, f.length - ext.length));
}

export function getNewsBySlug(slug: string, lang: Lang = Lang.be): Promise<string> {
  const fullPath = path.resolve(newsDirectory, lang, `${slug}${ext}`);

  try {
    return fsPromises.readFile(fullPath, "utf8");
  } catch (e) {
    throw new Error(`News file was not found at ${fullPath}`);
  }
}
