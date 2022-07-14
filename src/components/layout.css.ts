import { style } from "@vanilla-extract/css";
import { sprinkles } from "./sprinkles.css";

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
