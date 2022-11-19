export interface News extends NewsMetadata {
  content: string;
}

export interface NewsMetadata {
  slug: string;
  title: string;
  date: string;
  backgroundUrl: string;
  tags: ('featured-main' | 'featured' | 'event')[];
}

export interface EventMetadata extends NewsMetadata {
  location: string;
  eventDate: string;
}

export interface Event extends News, EventMetadata {}

export enum Lang {
  be = 'be',
  nl = 'nl',
  ru = 'ru',
}
