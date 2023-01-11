import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const menuItem = style([
  {
    display: "inline-block",
    borderStyle: "none solid none none",
    borderWidth: "1px",
    borderColor: vars.color.red,
    padding: "0.3rem 0.8rem",
    selectors: {
      "&:last-child": {
        borderRight: "none",
      },
    },
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
    padding: 0,
    margin: 0,
  },
]);
