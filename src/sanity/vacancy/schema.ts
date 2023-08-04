import { CaseIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "@sanity-typed/types";

import { isUniqueOtherThanLanguage } from "../lib/validation";

const vacancy = defineType({
  name: "vacancy",
  title: "Vacancy",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "id",
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
      name: "tasks",
      title: "Tasks",
      type: "array",
      validation: (Rule) => Rule.required(),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              type: "string",
              name: "title",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              type: "text",
              name: "description",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
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

export default vacancy;
