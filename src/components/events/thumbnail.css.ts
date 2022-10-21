import { globalStyle, style } from "@vanilla-extract/css";
import { animatedCard, vars } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const thumbnail = style([
  animatedCard,
  {
    selectors: {
      "&:last-child": {
        marginRight: "auto",
      },
      "&:first-child": {
        marginLeft: "auto",
      },
    },
    maxHeight: "20rem",
    width: "15rem",
    padding: "1rem",
    textDecoration: "none",
  },
]);

export const eventsBlock = style([sprinkles({})]);
export const date = style([
  {
    margin: 0,
    color: vars.color.grey,
  },
]);
export const title = style([sprinkles({})]);
export const locationText = style([
  {
    margin: 0,
    color: vars.color.grey,
  },
]);

globalStyle(`${locationText} path`, {
  fill: vars.color.grey,
});

export const locationIcon = style({
  paddingRight: "0.5rem",
})
