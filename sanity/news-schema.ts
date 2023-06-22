import { defineArrayMember, defineField, defineType } from "@sanity-typed/types";
import { isUniqueOtherThanLanguage } from "./vacancy-schema";

const news = defineType({
  name: "news",
  title: "News",
  type: "document",
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
      name: "imageRatio",
      title: "Image ratio",
      type: "string",
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
      type: "boolean",
    }),
    defineField({
      name: "featured",
      title: "Featured as small picture",
      type: "boolean",
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
