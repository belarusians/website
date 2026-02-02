import { defineArrayMember, defineType } from 'sanity';

import { supportedLanguages } from './locales';

const localeContent = defineType({
  name: 'localeContent',
  title: 'Locale content',
  type: 'object',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
      }),
    ],
  })),
  validation: (Rule) => Rule.required(),
});

export default localeContent;
