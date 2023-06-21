import { CleanEventSchema } from "../../sanity.config";

export enum NewsTags {
  Main = "featured-main",
  Secondary = "featured",
}

export enum ArticleType {
  News = "news",
}

export interface ArticleMeta {
  type: ArticleType;
  slug: string;
  title: string;
  date: string;
  backgroundUrl: string;
  tags: NewsTags[];
  imageRatio?: string;
}

export interface Article extends ArticleMeta {
  description?: string;
  content: string;
}

export interface NewsMeta extends ArticleMeta {
  type: ArticleType.News;
}

export type Event = Modify<
  CleanEventSchema,
  {
    slug: string;
    backgroundUrl: string;
    content: string;
  }
>;

export type News = Article & NewsMeta;

export type Modify<T, R> = Omit<T, keyof R> & R;

export enum Lang {
  be = "be",
  nl = "nl",
  ru = "ru",
}
