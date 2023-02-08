import { globalStyle, style } from "@vanilla-extract/css";
import { animatedCard, shadowedElement, toCenterAll } from "../common.styles.css";
import { vars } from "../styles.css";
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
  {
    maxHeight: "18rem",
    padding: "1rem",
    textDecoration: "none",
  },
]);

export const futureThumbnail = style([toCenterAll, thumbnail, animatedCard]);

export const pastThumbnail = style([
  thumbnail,
  shadowedElement,
  {
    cursor: "unset",
    filter: "brightness(0.55) blur(2px)",
  },
]);

export const placeholder = style([
  {
    fontSize: "1.3rem",
    alignSelf: "center",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 100,
    filter: "unset",
    color: vars.color.white,
    textTransform: "uppercase",
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
