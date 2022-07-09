import { style } from "@vanilla-extract/css";

import { sprinkles } from "../sprinkles.css";

export const image = style([
  sprinkles({
    width: {
      xs: "50px",
      lg: "200px",
    },
    height: {
      xs: "50px",
      lg: "200px",
    },
  }),
  {},
]);
