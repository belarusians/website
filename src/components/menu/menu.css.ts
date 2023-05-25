import { style } from "@vanilla-extract/css";
import { vars } from "../styles.css";

export const menu = style([
  {
    lineHeight: "normal",
    display: "flex",
    alignItems: "center",
    width: "100%",
    textTransform: "uppercase",
    fontWeight: 500,
    color: vars.color.red,
  },
]);

export const menuList = style([
  {
    padding: 0,
    margin: 0,
  },
]);
