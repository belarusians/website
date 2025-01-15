import { defineField, defineType } from '@sanity-typed/types';
import { BlockContentIcon } from '@sanity/icons';

const news = defineType({
  name: 'news',
  title: 'Навіны',
  type: 'document',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  icon: BlockContentIcon,
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
      name: 'featuredMain',
      title: 'Featured as big picture',
      description:
        'Only one news can be featured as big picture. If many are featured, the freshest one will be shown.',
      type: 'boolean',
      initialValue: false,
      readOnly: ({ document }) => document?.featured as boolean,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured as small picture',
      description:
        'Only 2 news can be featured as small pictures. If more than 2 are featured, the freshest 2 will be shown.',
      type: 'boolean',
      initialValue: false,
      readOnly: ({ document }) => document?.featuredMain as boolean,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishingDate',
      title: 'Publishing date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
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
  initialValue: () => ({
    publishingDate: new Date().toISOString(),
  }),
});

export default news;
