import { style } from "@vanilla-extract/css";

import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const header = style([
  sprinkles({
    marginTop: {
      sm: "0.5rem",
      md: "1rem"
    }
  }),
  {
    display: "flex",
    alignItems: "center",
  },
]);

export const image = style([
  sprinkles({
    height: {
      sm: "50px",
      md: "100px",
      lg: "150px",
    },
    width: {
      sm: "87px",
      md: "173px",
      lg: "260px",
    },
  }),
  {
    boxShadow: vars.shadows.small,
    position: 'relative',
  },
]);

export const languageSelector = style({
  marginLeft: "auto",
});

export const title = style([
  sprinkles({}),
  {
    fontWeight: 400,
    marginLeft: "20px",
    marginRight: "20px",
  },
]);

export const titleDescription = style([
  sprinkles({
    fontSize: {
      sm: "0.8rem",
      lg: "1rem",
    },
    marginTop: {
      sm: 0,
      md: "0.5rem",
    },
  }),
  {
    fontWeight: 300,
  },
]);

export const titleHeading = style([
  sprinkles({
    fontSize: {
      sm: "1.2rem",
      lg: "2rem",
    },
  }),
  {
    marginBottom: 0,
  },
]);
