import { defineArrayMember, defineField, defineType } from "@sanity-typed/types";
import { isUniqueOtherThanLanguage } from "./vacancy-schema";

const event = defineType({
  name: "event",
  title: "Event",
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
      name: "eventDate",
      title: "Event date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "geoLocation",
      title: "Location",
      type: "geopoint",
    }),
    defineField({
      name: "ticketsLink",
      title: "Tickets link",
      type: "url",
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
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export default event;
