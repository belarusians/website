import { style } from "@vanilla-extract/css";
import { vars } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const redColor = style({
  fill: vars.color.red,
});

export const whiteColor = style({
  fill: vars.color.white,
});

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
