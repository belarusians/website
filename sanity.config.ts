/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...index]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig, InferSchemaValues } from '@sanity-typed/types';
import { structureTool } from 'sanity/structure';
import { beBYLocale } from '@sanity/locale-be-by';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import vacancy from './src/sanity/vacancy/schema';
import feedback from './src/sanity/feedback/schema';
import event from './src/sanity/event/schema';
import news from './src/sanity/news/schema';
import guide from './src/sanity/guide/schema';
import { LogoIcon } from './src/components/header/logo-icon';
import localeString from './src/sanity/locale-schemas/string';
import localeText from './src/sanity/locale-schemas/text';
import localeContent from './src/sanity/locale-schemas/content';
import timeframe from './src/sanity/timeframe';
import type { PortableTextBlock } from '@portabletext/types';
import { Modify } from '@/components/types';

const config = defineConfig({
  basePath: '/studio',
  title: 'MARA - Студыя',
  projectId,
  dataset,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  icon: LogoIcon,
  schema: {
    types: [localeString, localeText, localeContent, timeframe, event, news, guide, feedback, vacancy],
    // templates: (prev) => prev.filter((template) => !['vacancy', 'event', 'news', 'feedback'].includes(template.id)),
  },
  plugins: [
    beBYLocale(),
    structureTool({
      structure: (S) => S.list().title('Дакументы').items(S.documentTypeListItems()),
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

export default config;

type Values = InferSchemaValues<typeof config>;

export type FeedbackSchema = Values['feedback'];

export type VacancySchema = Values['vacancy'];

export type EventSchema = Modify<
  Omit<Values['event'], '_createdAt' | '_type' | '_id' | '_updatedAt' | '_rev'>,
  {
    content: PortableTextBlock;
    slug: string;
    title: string;
    description: string;
    ticketsLabel?: string;
    tipsLabel?: string;
    successText?: string;
  }
>;

export type NewsSchema = Modify<
  Omit<Values['news'], '_createdAt' | '_type' | '_id' | '_updatedAt' | '_rev'>,
  {
    content: PortableTextBlock;
    slug: string;
    title: string;
    description: string;
  }
>;

export type GuideSchema = Modify<
  Omit<Values['guide'], '_createdAt' | '_type' | '_id' | '_updatedAt' | '_rev'>,
  {
    content: PortableTextBlock;
    slug: string;
    title: string;
    excerpt: string;
  }
>;
