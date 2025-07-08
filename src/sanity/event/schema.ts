import { defineField, defineType } from '@sanity-typed/types';
import { CalendarIcon } from '@sanity/icons';

const event = defineType({
  name: 'event',
  title: 'Імпрэзы',
  type: 'document',
  options: {},
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'slug',
      title: 'ID',
      type: 'slug',
      options: {
        source: 'title.be',
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) {
            return 'Slug is required';
          }
          if (/[A-Z]/.test(slug.current)) {
            return 'Slug must not contain uppercase letters';
          }
          if (/\s/.test(slug.current)) {
            return 'Slug must not contain spaces';
          }
          if (/[^a-z0-9\-]/.test(slug.current)) {
            return 'Slug must only contain lowercase letters, numbers and dashes';
          }

          return true;
        }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundUrl',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'localeContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timeframe',
      title: 'Час імпрэзы',
      type: 'timeframe',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rescheduled',
      title: 'Змена ў даце',
      type: 'boolean',
      readOnly: ({ document }) => document?.cancelled as boolean,
    }),
    defineField({
      name: 'cancelled',
      title: 'Адменена',
      type: 'boolean',
      initialValue: false,
      readOnly: ({ document }) => document?.rescheduled as boolean,
    }),
    defineField({
      name: 'rescheduledTimeframe',
      title: 'Новы час',
      description: 'калі не вядома - пакінуць пустым',
      type: 'timeframe',
      hidden: ({ parent }) => !parent?.rescheduled || parent?.cancelled,
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
      type: 'localeString',
    }),
    defineField({
      name: 'tipsLink',
      title: 'Tips link',
      type: 'url',
    }),
    defineField({
      name: 'tipsLabel',
      title: 'Tips button text',
      type: 'localeString',
    }),
    defineField({
      name: 'successText',
      title: 'Payment success message',
      description: 'Message shown instead of tickets button after successful payment',
      type: 'localeString',
    }),
    defineField({
      name: 'gtmEventValue',
      title: 'GTM',
      description: 'Google Tag Manager conversion ID',
      type: 'string',
      validation: (Rule) => Rule.optional(),
    }),
  ],
  preview: {
    select: {
      title: 'title.be',
      media: 'backgroundUrl',
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});

export default event;
