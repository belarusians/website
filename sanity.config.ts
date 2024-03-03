/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...index]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig, InferSchemaValues } from '@sanity-typed/types';
import { structureTool } from 'sanity/structure';
import { documentInternationalization } from '@sanity/document-internationalization';
import { beBYLocale } from '@sanity/locale-be-by';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import vacancy from './src/sanity/vacancy/schema';
import feedback from './src/sanity/feedback/schema';
import event from './src/sanity/event/schema';
import news from './src/sanity/news/schema';
import { LogoIcon } from './src/components/header/logo-icon';
import localeString from './src/sanity/locale-schemas/string';
import localeText from './src/sanity/locale-schemas/text';
import localeContent from './src/sanity/locale-schemas/content';

const config = defineConfig({
  basePath: '/studio',
  title: 'MARA - Студыя',
  projectId,
  dataset,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  icon: LogoIcon,
  schema: {
    types: [localeString, localeText, localeContent, vacancy, event, news, feedback],
    // templates: (prev) => prev.filter((template) => !['vacancy', 'event', 'news', 'feedback'].includes(template.id)),
  },
  plugins: [
    beBYLocale(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Дакументы')
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
      schemaTypes: ['vacancy', 'news', 'feedback'],
    }),
  ],
});

export default config;

type Values = InferSchemaValues<typeof config>;

export type Feedback = Values['feedback'];

export type Vacancy = Values['vacancy'];

export type EventSchema = Omit<Values['event'], '_createdAt' | '_type' | '_id' | '_updatedAt' | '_rev'>;

export type NewsSchema = Values['news'];
export type CleanNewsSchema = Omit<NewsSchema, '_createdAt' | '_type' | '_id' | '_updatedAt' | '_rev' | 'language'>;
