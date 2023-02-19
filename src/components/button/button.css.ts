import { keyframes, style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";
import { rounded, shadowedElement } from "../common.styles.css";

export const button = style([
  shadowedElement,
  rounded,
  sprinkles({
    paddingY: {
      sm: "small",
      md: "medium",
      lg: "large",
    },
    paddingX: {
      sm: "small",
      md: "medium",
      lg: "large",
    },
    fontSize: {
      sm: "0.8rem",
      md: "1rem",
      lg: "1.2rem",
    },
  }),
  {
    backgroundColor: vars.color.white,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.15s ease-in-out",
    selectors: {
      "&:hover": {
        boxShadow: vars.shadows.medium,
      },
      "&:active": {
        boxShadow: vars.shadows.large,
      },
    },
  },
]);

export const loadingSpace = style({
  paddingLeft: "2.5rem",
});

const rotate = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

export const spinner = style({
  position: "absolute",
  marginLeft: "-1.6rem",
  marginRight: "1rem",
  marginTop: "0.15rem",
  selectors: {
    "&.hide": {
      opacity: "0%",
    },
    "&.show": {
      opacity: "100%",
    },
    "&:after": {
      content: " ",
      display: "block",
      width: "0.54rem",
      height: "0.54rem",
      borderRadius: "50%",
      border: `3px solid ${vars.color.red}`,
      borderColor: `${vars.color.red} transparent ${vars.color.red} transparent`,
      animation: `${rotate} 1.2s linear infinite`,
    },
  },
  transition: "all 0.15s ease-in-out",
});
