import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";
import { removeUnderline, rounded, roundedBottom } from "../common.styles.css";

const title = style([
  {
    textTransform: "uppercase",
    color: vars.color.white,
  },
]);

export const largeTitle = style([
  title,
  sprinkles({
    fontSize: {
      sm: "1.2rem",
      md: "1.5rem",
      lg: "2rem",
    },
  }),
]);

export const smallTitle = style([
  title,
  sprinkles({
    fontSize: {
      sm: "0.8rem",
      md: "1rem",
      lg: "1.2rem",
    },
  }),
]);

export const mediumTitle = style([
  title,
  sprinkles({
    fontSize: {
      sm: "1rem",
      md: "1.2rem",
      lg: "1.5rem",
    },
  }),
]);

export const image = style([
  rounded,
  {
    maxWidth: "100%",
    height: "auto",
    filter: "brightness(0.8)",
  },
]);

export const titleContainer = style([
  roundedBottom,
  {
    position: "absolute",
    padding: "0.5rem",
    zIndex: 500,
    // backdropFilter: "blur(10px)",
    bottom: 0,
    // marginTop: "auto",
  },
]);

export const thumbnail = style([
  removeUnderline,
  {
    position: "relative",
  },
]);
