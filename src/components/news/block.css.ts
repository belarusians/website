import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";

export const newsItem = style([
  {
    marginBottom: "1rem",
    // flex: "2 0 20%",
  },
]);

export const newsBlock = style([
  sprinkles({
    columnCount: {
      sm: 2,
      md: 3,
      lg: 4,
    },
  }),
  {
    // display: "flex",
    // flexWrap: "wrap",
    // flexDirection: "row",
  },
]);
