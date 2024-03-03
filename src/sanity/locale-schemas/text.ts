import { supportedLanguages } from './locales';
import { defineType } from '@sanity-typed/types';

const localeText = defineType({
  name: 'localeText',
  title: 'Locale text',
  type: 'object',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    rows: 4,
    type: 'text',
  })),
});

export default localeText;
