import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const footer = style([
  sprinkles({
    fontSize: {
      sm: "0.6rem",
      md: "1rem",
    },
    backgroundColor: {
      sm: vars.color.red,
      md: vars.color.white,
      lg: vars.color.white,
    },
    color: {
      sm: vars.color.white,
    },
    paddingBottom: {
      sm: "0.5rem",
      md: "1rem",
      lg: "2rem",
    },
  }),
  {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: "0.5rem",
  },
]);

export const link = style([
  sprinkles({
    marginRight: {
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
    },
  }),
]);

export const icon = style([
  sprinkles({
    fontSize: {
      sm: "1.5rem",
      md: "1.5rem",
      lg: "2rem",
    },
    color: {
      sm: vars.color.white,
    },
  }),
]);

export const disclaimer = style([
  {
    fontSize: "0.8rem",
    fontWeight: 300,
    letterSpacing: ".045em",
    marginLeft: "auto",
  },
]);
