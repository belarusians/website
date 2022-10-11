import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";

export const section = style([
  sprinkles({
    paddingX: {
      sm: "large",
      md: "extraLarge",
    },
  }),
]);