import { HeartIcon } from '@sanity/icons';
import { defineField, defineType } from '@sanity-typed/types';

const feedback = defineType({
  name: 'feedback',
  title: 'Водгукі',
  type: 'document',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'signature',
      title: 'Signature',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      signature: 'signature.be',
    },
    prepare({ title }) {
      return {
        title,
      };
    },
  },
});

export default feedback;
