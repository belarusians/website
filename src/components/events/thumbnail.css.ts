import { globalStyle, style } from "@vanilla-extract/css";
import { animatedCard, vars } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const thumbnail = style([
  sprinkles({
    width: {
      sm: "9rem",
      md: "14rem",
      lg: "14rem",
    },
    fontSize: {
      sm: "0.8rem",
      md: "1rem",
      lg: "1rem",
    },
  }),
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
    maxHeight: "18rem",
    padding: "1rem",
    textDecoration: "none",
  },
]);

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
});
