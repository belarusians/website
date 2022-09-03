import { style } from "@vanilla-extract/css";

import { sprinkles, vars } from "../sprinkles.css";

export const header = style([
  {
    minHeight: "100px",
    display: "flex",
    alignItems: "center",
  },
]);

export const image = style([
  sprinkles({
    minHeight: {
      xs: "50px",
      md: "100px",
      lg: "150px",
    },
    height: {
      xs: "50px",
      md: "100px",
      lg: "150px",
    },
    minWidth: {
      xs: "87px",
      md: "173px",
      lg: "260px",
    },
    width: {
      xs: "87px",
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
      xs: "0.8rem",
      lg: "1rem",
    },
    marginTop: {
      xs: 0,
      md: "10px",
    },
  }),
  {
    fontWeight: 300,
  },
]);

export const titleHeading = style([
  sprinkles({
    fontSize: {
      xs: "1.2rem",
      lg: "2rem",
    },
  }),
  {
    marginBottom: 0,
  },
]);
