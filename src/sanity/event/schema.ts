import { defineArrayMember, defineField, defineType } from '@sanity-typed/types';
import { CalendarIcon } from '@sanity/icons';

import { isUniqueOtherThanLanguage } from '../lib/validation';

const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'slug',
      title: 'ID',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: isUniqueOtherThanLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundUrl',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ticketsLink',
      title: 'Tickets link',
      type: 'url',
    }),
    defineField({
      name: 'ticketsLabel',
      title: 'Tickets button text',
      type: 'string',
    }),
    defineField({
      name: 'tipsLink',
      title: 'Tips link',
      type: 'url',
    }),
    defineField({
      name: 'tipsLabel',
      title: 'Tips button text',
      type: 'string',
    }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export default event;
