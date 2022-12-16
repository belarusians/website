import { style } from "@vanilla-extract/css";
import { toCenterAll, vars } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const counter = style([
  sprinkles({
    fontSize: {
      sm: "3rem",
      md: "5rem",
    },
  }),
]);

export const achievementContainer = style([
  toCenterAll,
  {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    color: vars.color.white,
  },
]);

export const counterText = style([
  sprinkles({
    fontSize: {
      sm: "1.2rem",
      md: "1.5rem",
    },
  }),
]);
