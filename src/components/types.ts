import { SanityImageDimensions } from "@sanity/asset-utils";

import { CleanEventSchema, CleanNewsSchema } from "../../sanity.config";

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
> &
  SanityImageDimensions;

export type Modify<T, R> = Omit<T, keyof R> & R;

export enum Lang {
  be = "be",
  nl = "nl",
}
