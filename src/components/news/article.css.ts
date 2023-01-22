import { style } from "@vanilla-extract/css";
import { card, roundedTop } from "../common.styles.css";
import { sprinkles } from "../sprinkles.css";

export const article = style([card, {}]);

export const articleImageContainer = style([
  sprinkles({
    height: {
      sm: "9rem",
      md: "18rem",
      lg: "18rem",
    },
  }),
  roundedTop,
  {
    position: "relative",
    selectors: {
      "&:before": {
        zIndex: 100,
        content: "",
        backgroundImage: "linear-gradient(to top, rgba(255,255,255,255), rgba(255,255,255,0))",
        position: "absolute",
        height: "4rem",
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  },
]);

export const articleImage = style([
  roundedTop,
  {
    objectFit: "cover",
  },
]);

export const articleContent = style([
  sprinkles({
    paddingX: {
      sm: "large",
      md: "large",
      lg: "extraLarge",
    },
    paddingBottom: {
      sm: "large",
      md: "large",
      lg: "extraLarge",
    },
  }),
  {
    lineHeight: "1.5rem",
  },
]);
