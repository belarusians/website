import { style } from "@vanilla-extract/css";

import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const header = style([
  sprinkles({
    paddingTop: {
      sm: "0.5rem",
      md: "1rem",
      lg: "2rem",
    },
    paddingBottom: {
      sm: "0.5rem",
      md: "0.5rem",
      lg: "1rem",
    },
    position: {
      sm: "sticky",
    },
    backgroundColor: {
      sm: vars.color.red,
      md: vars.color.white,
    },
  }),
  {
    display: "flex",
    alignItems: "center",
    top: 0,
    zIndex: 100,
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
