import { CleanEventSchema, CleanNewsSchema } from "../../sanity.config";

export interface LegacyNewsMeta {
  slug: string;
  title: string;
  date: string;
  backgroundUrl: string;
  imageRatio?: string;
}

export type Event = Modify<
  CleanEventSchema,
  {
    slug: string;
    backgroundUrl: string;
    content: string;
  }
>;

export type News = Modify<
  CleanNewsSchema,
  {
    slug: string;
    backgroundUrl: string;
    content: string;
  }
>;

export type LegacyNews = Modify<
  Omit<News, "publishingDate" | "featured" | "featuredMain">,
  {
    description?: string;
  }
>;

export type Modify<T, R> = Omit<T, keyof R> & R;

export enum Lang {
  be = "be",
  nl = "nl",
  ru = "ru",
}
