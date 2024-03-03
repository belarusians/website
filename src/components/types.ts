import { EventSchema, CleanNewsSchema } from '../../sanity.config';

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

export type News = Modify<
  CleanNewsSchema,
  {
    slug: string;
    content: string;
  }
>;

export type Modify<T, R> = Omit<T, keyof R> & R;

export enum Lang {
  be = 'be',
  nl = 'nl',
}
