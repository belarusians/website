import { style } from "@vanilla-extract/css";
import { sprinkles } from "../../sprinkles.css";

export const languageSelector = style([
  sprinkles({
    marginLeft: {
      sm: "0.3rem",
      md: "1rem",
      lg: "1rem",
    },
  }),
  {},
]);
