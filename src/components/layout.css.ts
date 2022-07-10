import { style } from "@vanilla-extract/css";
import { sprinkles } from "./sprinkles.css";

const ui = sprinkles({
  paddingX: {
    xs: "extraSmall",
    sm: "small",
    md: "medium",
    lg: "large",
    xl: "extraLarge",
  },
});

export const section = style([ui]);
