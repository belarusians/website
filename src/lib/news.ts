import * as path from 'path';
import * as fs from 'fs';
import matter from "gray-matter";
import { remark } from 'remark';
import html from 'remark-html';

import { News } from "../pages/news/types";

const newsDirectory = path.join(process.cwd(), '_news');

export function getNewsSlugs(): string[] {
  const news = fs.readdirSync(newsDirectory);
  return news.map(f => f.substring(0, f.length-3));
}

export async function getNewsBySlug(slug: string): Promise<News> {
  const fullPath = path.join(newsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`News was not found at ${fullPath}`);
  }

  const file = fs.readFileSync(fullPath, 'utf8');
  const fileWithParsedFM = matter(file);
  const content = await markdownToHTML(fileWithParsedFM.content);

  return {
    title: fileWithParsedFM.data.title,
    date: fileWithParsedFM.data.date,
    backgroundUrl: fileWithParsedFM.data.backgroundUrl,
    content,
  };
}

async function markdownToHTML(content: string): Promise<string> {
  const result = await remark().use(html).process(content);

  return result.toString();
}