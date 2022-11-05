import { style } from "@vanilla-extract/css";

import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const header = style([
  sprinkles({
    marginTop: {
      sm: "1rem",
      md: "1rem",
      lg: "2rem",
    },
    marginBottom: {
      sm: 0,
      md: "0.5rem",
      lg: "1rem",
    },
  }),
  {
    display: "flex",
    alignItems: "center",
  },
]);

export const logoContainer = style({
  display: "flex",
});

export const logo = style([
  sprinkles({
    width: {
      sm: "9rem",
      md: "14rem",
      lg: "23rem",
    },
  }),
]);

export const languageSelector = style({
  marginLeft: "auto",
});

export const aboutUs = style([
  sprinkles({
    fontSize: {
      sm: "0.6rem",
      md: "1rem",
      lg: "1rem",
    },
    marginLeft: {
      sm: "0.3rem",
      md: "1rem",
      lg: "1rem",
    },
  }),
  {
    textTransform: "uppercase",
    fontWeight: 500,
    color: vars.color.red,
  },
]);
