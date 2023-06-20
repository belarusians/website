export enum NewsTags {
  Main = "featured-main",
  Secondary = "featured",
}

export enum ArticleType {
  News = "news",
  Event = "event",
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

export interface EventMeta extends ArticleMeta {
  type: ArticleType.Event;
  location: string;
  eventDate: string;
  ticketsLink: string;
}

export interface NewsMeta extends ArticleMeta {
  type: ArticleType.News;
}

export type Event = Article & EventMeta;

export type News = Article & NewsMeta;

export enum Lang {
  be = "be",
  nl = "nl",
  ru = "ru",
}
