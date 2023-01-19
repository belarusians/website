import { style } from "@vanilla-extract/css";
import { sprinkles } from "../../sprinkles.css";
import { vars } from "../../styles.css";

export const languageSelector = style([
  sprinkles({
    marginLeft: {
      sm: "0.3rem",
      md: "1rem",
      lg: "1rem",
    },
  }),
]);

export const joinUsButton = style({
  textTransform: "none",
  fontWeight: 400,
  marginRight: "1rem",
});

export const menuItem = style([
  sprinkles({
    fontSize: {
      sm: "0.6rem",
      md: "0.8rem",
      lg: "1rem",
    },
  }),
  {
    textDecoration: "none",
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
