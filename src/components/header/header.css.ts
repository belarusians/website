import { style } from "@vanilla-extract/css";

import { sprinkles } from "../sprinkles.css";

export const header = style({
  display: "flex",
  alignItems: "center",
});

export const image = style([
  sprinkles({
    height: {
      xs: "50px",
      md: "100px",
      lg: "150px",
    },
    width: {
      xs: "87px",
      md: "173px",
      lg: "260px",
    },
  }),
]);

export const languageSelector = style({
  marginLeft: "auto",
});

export const title = style([
  sprinkles({
    fontSize: {
      sm: "1rem",
      md: "1.2rem",
      lg: "1.5rem",
    },
  }),
  {
    fontWeight: 400,
    marginLeft: "20px",
  },
]);
