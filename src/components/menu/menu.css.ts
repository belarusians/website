import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const menuItem = style([
  {
    display: "inline-block",
  },
]);

export const aboutUs = style([
  menuItem,
  sprinkles({
    fontSize: {
      sm: "0.6rem",
      md: "1rem",
      lg: "1rem",
    },
    marginLeft: {
      sm: "0.3rem",
      md: "1rem",
      lg: "1rem",
    },
  }),
]);

export const menu = style([
  {
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
    textDecoration: "none",
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
]);

export const languageSelector = style({
  marginLeft: "auto",
});
