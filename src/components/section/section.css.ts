import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { animationFadeIn } from "../../utils/animation.css";

export const section = style([
  sprinkles({
    paddingY: {
      sm: "medium",
      md: "large",
      lg: "extraLarge",
    },
  }),
]);

export const sectionHeading = style([
  animationFadeIn,
  sprinkles({
    fontSize: {
      sm: "1.2rem",
    },
  }),
]);

// TODO: remove this dirty hack
export const form = style({
  marginLeft: "-12px",
});
