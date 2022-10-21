import { style } from "@vanilla-extract/css";
import { card, roundedTop } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const article = style([card, {}]);

export const articleImageContainer = style([
  roundedTop,
  {
    position: "relative",
    height: "20rem",
  },
]);

export const articleImage = style([
  roundedTop,
  {
    // selectors: {
    //   "&:before": {
    //     content: '',
    //     backgroundImage: "linear-gradient(to top, rgba(239,239,239,255), rgba(239,239,239,0))",
    //     position: "absolute",
    //     height: "5rem",
    //     right: 0,
    //     bottom: 0,
    //     left: 0,
    //   }
    // }
  }
]);

export const articleContent = style([
  sprinkles({
    padding: {
      sm: "large",
      md: "large",
      lg: "extraLarge",
    },
  },),
]);
