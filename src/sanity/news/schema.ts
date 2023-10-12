import { defineArrayMember, defineField, defineType } from "@sanity-typed/types";
import { BlockContentIcon } from "@sanity/icons";

import { isUniqueOtherThanLanguage } from "../lib/validation";

const news = defineType({
  name: "news",
  title: "News",
  type: "document",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "ID",
      type: "slug",
      options: {
        source: "title",
        isUnique: isUniqueOtherThanLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "backgroundUrl",
      title: "Image",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredMain",
      title: "Featured as big picture",
      description:
        "Only one news can be featured as big picture. If many are featured, the freshest one will be shown.",
      type: "boolean",
      initialValue: false,
      readOnly: ({ document }) => document?.featured as boolean,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured as small picture",
      description:
        "Only 2 news can be featured as small pictures. If more than 2 are featured, the freshest 2 will be shown.",
      type: "boolean",
      initialValue: false,
      readOnly: ({ document }) => document?.featuredMain as boolean,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishingDate",
      title: "Publishing date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  initialValue: () => ({
    publishingDate: new Date().toISOString(),
  }),
});

export default news;
