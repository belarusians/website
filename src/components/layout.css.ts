import { style } from "@vanilla-extract/css";
import { globalStyle } from "@vanilla-extract/css";

import { sprinkles } from "./sprinkles.css";

globalStyle("body, body *", {
  fontFamily: "'Work Sans', sans-serif;",
});

const ui = sprinkles({
  paddingX: {
    xs: "small",
    md: "none",
  },
});

export const section = style([
  ui,
  {
    maxWidth: "75rem",
    margin: "0 auto",
  },
]);
