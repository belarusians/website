export interface News extends NewsMetadata {
  content: string;
}

export enum NewsTags {
  Main = "featured-main",
  Secondary = "featured",
  Event = "event",
}

export interface NewsMetadata {
  slug: string;
  title: string;
  date: string;
  backgroundUrl: string;
  tags: NewsTags[];
  imageRatio?: string;
}

export interface EventMetadata extends NewsMetadata {
  location: string;
  eventDate: string;
}

export interface Event extends News, EventMetadata {}

export enum Lang {
  be = "be",
  nl = "nl",
  ru = "ru",
}

export interface CommonPageProps {
  lang?: Lang;
}
