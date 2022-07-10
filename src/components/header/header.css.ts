import { style } from "@vanilla-extract/css";

import { sprinkles } from "../sprinkles.css";

const imageUi = sprinkles({
  width: {
    xs: "50px",
    lg: "100px",
  },
  height: {
    xs: "50px",
    lg: "100px",
  },
});

export const header = style({
  display: "flex",
});

export const image = style([imageUi, {}]);

export const languageSelector = style({
  marginLeft: "auto",
});
