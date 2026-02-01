import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from '@sanity-typed/types';

const alienPassportFeedback = defineType({
  name: 'alienPassportFeedback',
  title: 'Пашпарт чужаземца - Зваротны сувязь',
  type: 'document',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'gemeente',
      title: 'Gemeente',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'complaint',
      title: 'Complaint',
      type: 'text',
      validation: (Rule) => Rule.required().max(5000),
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'string',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      gemeente: 'gemeente',
      submittedAt: 'submittedAt',
    },
    prepare({ gemeente, submittedAt }) {
      return {
        title: gemeente || 'No gemeente',
        subtitle: submittedAt ? new Date(submittedAt).toLocaleDateString() : '',
      };
    },
  },
});

export default alienPassportFeedback;
