import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { removeUnderline, vars } from "../styles.css";

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
      sm: "1.5rem",
      md: "2rem",
      lg: "2.5rem",
    },
  }),
]);

export const smallTitle = style([
  title,
  sprinkles({
    fontSize: {
      sm: "1.5rem",
      md: "2rem",
      lg: "1.5rem",
    },
  }),
]);

export const image = style([
  {
    borderRadius: "5px",
    filter: "brightness(0.8)",
  },
]);

export const titleContainer = style([
  {
    padding: "0.5rem",
    zIndex: 500,
    backdropFilter: "blur(10px)",
    marginTop: "auto",
    borderRadius: "0 0 5px 5px",
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
