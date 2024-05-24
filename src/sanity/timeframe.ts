import { defineField, defineType } from '@sanity-typed/types';

const timeframe = defineType({
  name: 'timeframe',
  title: 'Час імпрэзы',
  description: 'Калі імпрэза адбудзецца?',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      title: 'Пачатак',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'Канец',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export default timeframe;
