import { style } from "@vanilla-extract/css";
import { globalStyle } from "@vanilla-extract/css";

import { sprinkles, vars } from "./sprinkles.css";

globalStyle("body, body *", {
  fontFamily: "'Work Sans', sans-serif;",
  color: vars.color.black,
});

const ui = sprinkles({
  paddingX: {
    xs: "small",
    sm: "medium",
  },
});

export const section = style([
  ui,
  {
    maxWidth: "75rem",
    marginLeft: "auto",
    marginRight: "auto",
  },
]);
