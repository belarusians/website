import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";

export const section = style([
  sprinkles({
    paddingY: {
      sm: "medium",
      md: "large",
      lg: "extraLarge",
    },
  }),
]);