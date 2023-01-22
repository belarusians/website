import { style } from "@vanilla-extract/css";
import { vars } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const fillColor = style([
  sprinkles({
    fill: {
      sm: vars.color.white,
      md: vars.color.red,
      lg: vars.color.red,
    },
  }),
]);

export const bottomText = style([
  sprinkles({
    display: {
      sm: "none",
    },
  }),
  {
    fill: vars.color.black,
  },
]);
