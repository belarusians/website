import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const list = style({
  color: "white",
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  borderRadius: "5px",
  boxShadow: vars.shadows.small,
  selectors: {
    "&:hover": {
      boxShadow: vars.shadows.medium,
    },
  },
  transition: "all 0.15s ease-in-out",
});

export const button = style([
  sprinkles({
    padding: {
      sm: "extraSmall",
      md: "small",
    },
    fontSize: {
      sm: "1.5rem",
      md: "1.2rem",
    },
    fontWeight: 400,
  }),
  {
    color: vars.color.lightBlack,
    backgroundColor: "white",
    border: 0,
    cursor: "pointer",
    textTransform: "uppercase",
    selectors: {
      ["&:first-child"]: {
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
      },
      ["&:last-child"]: {
        borderTopRightRadius: "5px",
        borderBottomRightRadius: "5px",
      },
    },
  },
]);

export const active = style([
  {
    backgroundColor: vars.color.red,
    color: "white",
  },
]);
