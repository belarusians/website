/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...index]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig, InferSchemaValues } from "@sanity-typed/types";
import { deskTool } from "sanity/desk";
import { documentInternationalization } from "@sanity/document-internationalization";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import vacancy from "./sanity/vacancy-schema";
import event from "./sanity/event-schema";

const config = defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: [vacancy, event],
    templates: (prev) => prev.filter((template) => !["vacancy", "event"].includes(template.id)),
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    deskTool(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    visionTool({ defaultApiVersion: apiVersion }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    documentInternationalization({
      supportedLanguages: [
        { id: "be", title: "Беларуская" },
        { id: "nl", title: "Nederlands" },
        { id: "ru", title: "Русский" },
      ],
      schemaTypes: ["vacancy", "event"],
    }),
  ],
});

export default config;

type Values = InferSchemaValues<typeof config>;

export type Vacancy = Extract<Values, { _type: "vacancy" }>;
export type EventSchema = Extract<Values, { _type: "event" }>;
export type CleanEventSchema = Omit<EventSchema, "_createdAt" | "_type" | "_id" | "_updatedAt" | "_rev" | "language">;
