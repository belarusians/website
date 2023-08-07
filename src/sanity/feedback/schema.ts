import { HeartIcon } from "@sanity/icons";
import { defineField, defineType } from "@sanity-typed/types";

const feedback = defineType({
  name: "feedback",
  title: "Feedback",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "signature",
      title: "Signature",
      type: "string",
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

export default feedback;
