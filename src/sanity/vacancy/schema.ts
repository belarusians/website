import { CaseIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { isUniqueOtherThanLanguage } from '../lib/validation';

const vacancy = defineType({
  name: 'vacancy',
  title: 'Вакансіі',
  type: 'document',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'slug',
      options: {
        source: 'title.be',
        isUnique: isUniqueOtherThanLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tasks',
      title: 'Tasks',
      type: 'array',
      validation: (Rule) => Rule.required(),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              type: 'localeString',
              name: 'title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              type: 'localeText',
              name: 'description',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title.be',
            },
            prepare({ title }) {
              return {
                title,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.be',
    },
    prepare({ title }) {
      return {
        title,
      };
    },
  },
});

export default vacancy;
