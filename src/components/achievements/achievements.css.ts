import { style } from "@vanilla-extract/css";
import { toCenterAll, vars } from "../styles.css";

export const counter = style([
  {
    fontSize: "5rem",
  },
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
  {
    fontSize: "1.5rem",
  },
]);
