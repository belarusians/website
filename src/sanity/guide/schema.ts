import { defineField, defineType } from '@sanity-typed/types';
import { BookIcon } from '@sanity/icons';

const guide = defineType({
  name: 'guide',
  title: 'Даведнікі',
  type: 'document',
  icon: BookIcon,
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localeText',
      description: 'Short description or summary of the guide',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'localeContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Mark this guide as featured to show it prominently',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.be',
      subtitle: 'excerpt.be',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
  initialValue: () => ({
    publishedAt: new Date().toISOString(),
    featured: false,
  }),
});

export default guide;
