import { EventSchema, FeedbackSchema, NewsSchema } from '../../sanity.config';

export type Feedback = Modify<FeedbackSchema, { text: string; signature: string; }>

export type EventWithoutHTMLContent = Modify<
  EventSchema,
  {
    slug: string;
    title: string;
    description: string;
    ticketsLabel?: string;
    tipsLabel?: string;
    successText?: string;
  }
>;

export type Event = Modify<EventWithoutHTMLContent, { content: string }>;

// TODO: shit naming
export type NewsWithoutHTMLContent = Modify<
  NewsSchema,
  {
    slug: string;
    title: string;
    description: string;
  }
>;

export type News = Modify<NewsWithoutHTMLContent, { content: string }>;

export type Modify<T, R> = Omit<T, keyof R> & R;

export enum Lang {
  be = 'be',
  nl = 'nl',
}
