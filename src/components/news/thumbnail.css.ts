import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { removeUnderline, rounded, roundedBottom, vars } from "../styles.css";

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
      sm: "1.2rem",
      md: "1.5rem",
      lg: "1.5rem",
    },
  }),
]);

export const image = style([
  rounded,
  {
    objectFit: "cover",
    filter: "brightness(0.8)",
  },
]);

export const titleContainer = style([
  roundedBottom,
  {
    padding: "0.5rem",
    zIndex: 500,
    backdropFilter: "blur(10px)",
    marginTop: "auto",
  },
]);

export const thumbnail = style([
  removeUnderline,
  {
    position: "relative",
    flexDirection: "column",
    display: "flex",
    flex: "1",
  },
]);
