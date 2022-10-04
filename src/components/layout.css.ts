import { style } from "@vanilla-extract/css";
import { globalStyle } from "@vanilla-extract/css";

import { sprinkles } from "./sprinkles.css";
import { vars } from "./styles.css";

globalStyle("body, body *", {
  fontFamily: "'Work Sans', sans-serif;",
  color: vars.color.black,
});

export const section = style([
  sprinkles({
    paddingX: {
      sm: "large",
      md: "extraLarge",
    },
  }),
  {
    maxWidth: "80rem",
    marginLeft: "auto",
    marginRight: "auto",
  },
]);
