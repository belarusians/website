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
      sm: "2rem",
      md: "4rem",
      lg: "7rem",
    },
  }),
]);

export const logoText = style([
  {
    paddingTop: "1rem",
    color: vars.color.red,
    marginTop: "auto",
    fontWeight: 900,
    fontSize: "6rem",
    lineHeight: "5rem",
    textTransform: "uppercase",
    fontFamily: "'Lato', sans-serif;"
  },
]);

export const logoDescription = style([
  {
    fontSize: "0.95rem",
    marginTop: "0.3rem",
    marginBottom: "auto",
    fontWeight: 300,
    textTransform: "uppercase",
    paddingLeft: "0.4rem",
    fontFamily: "'Roboto', sans-serif;"
  },
]);

export const logoTextContainer = style([
  sprinkles({
    display: {
      sm: "none",
      md: "none",
      lg: "flex",
    },
  }),
  {
    marginLeft: "0.8rem",
    flexDirection: "column",
  },
]);

export const languageSelector = style({
  marginLeft: "auto",
});
