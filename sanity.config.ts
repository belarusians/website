/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...index]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig, InferSchemaValues } from '@sanity-typed/types';
import { deskTool } from 'sanity/desk';
import { documentInternationalization } from '@sanity/document-internationalization';
import { beBYLocale } from '@sanity/locale-be-by';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env';
import vacancy from './src/sanity/vacancy/schema';
import feedback from './src/sanity/feedback/schema';
import event from './src/sanity/event/schema';
import news from './src/sanity/news/schema';

const config = defineConfig({
  basePath: '/studio',
  title: 'MARA - Studio',
  projectId,
  dataset,
  schema: {
    types: [vacancy, event, news, feedback],
    templates: (prev) => prev.filter((template) => !['vacancy', 'event', 'news', 'feedback'].includes(template.id)),
  },
  plugins: [
    beBYLocale(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items(S.documentTypeListItems().filter((item) => item.getTitle() !== 'Translation metadata')),
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    visionTool({ defaultApiVersion: apiVersion }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    documentInternationalization({
      supportedLanguages: [
        { id: 'be', title: 'Беларуская' },
        { id: 'nl', title: 'Nederlands' },
      ],
      schemaTypes: ['vacancy', 'event', 'news', 'feedback'],
    }),
  ],
});

export default config;

type Values = InferSchemaValues<typeof config>;

export type Feedback = Values['feedback'];

export type Vacancy = Values['vacancy'];

export type EventSchema = Values['event'];
export type CleanEventSchema = Omit<EventSchema, '_createdAt' | '_type' | '_id' | '_updatedAt' | '_rev' | 'language'>;

export type NewsSchema = Values['news'];
export type CleanNewsSchema = Omit<NewsSchema, '_createdAt' | '_type' | '_id' | '_updatedAt' | '_rev' | 'language'>;
