import { supportedLanguages } from './locales';
import { defineType } from '@sanity-typed/types';

const localeString = defineType({
  name: 'localeString',
  title: 'Locale string',
  type: 'object',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'string',
  })),
});

export default localeString;
