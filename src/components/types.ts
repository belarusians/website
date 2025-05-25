import { EventSchema, FeedbackSchema, GuideSchema, NewsSchema } from '../../sanity.config';

export type Feedback = Modify<FeedbackSchema, { text: string; signature: string }>;

export type Event = Modify<
  EventSchema,
  {
    content: string;
  }
>;

export type EventWithoutHTMLContent = Omit<Event, 'content'>;

export type News = Modify<
  NewsSchema,
  {
    content: string;
  }
>;

// TODO: shit naming
export type NewsWithoutHTMLContent = Omit<News, 'content'>;

export type Guide = Modify<
  GuideSchema,
  {
    content: string;
  }
>;

export type GuideWithoutHTMLContent = Omit<Guide, 'content'>;

export type Modify<T, R> = Omit<T, keyof R> & R;

export enum Lang {
  be = 'be',
  nl = 'nl',
}
