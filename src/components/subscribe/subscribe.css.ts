import { style } from "@vanilla-extract/css";
import { sprinkles, vars } from "../sprinkles.css";

export const subscribe = style([
  sprinkles({
    marginTop: {
      xs: "5px",
      sm: "10px",
    },
  }),
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
]);

export const subscribeTitle = style([
  sprinkles({
    fontSize: {
      xs: "1rem",
      md: "2rem",
    },
  }),
  {
    maxWidth: "50rem",
    fontWeight: 600,
    textAlign: "center",
  },
]);

export const subscribeInput = style([
  sprinkles({}),
  {
    all: "unset",
    textAlign: "center",
    padding: "0.8rem 1.2rem",
    minWidth: "20rem",
    borderRadius: "5px",
    boxShadow: vars.shadows.small,
    fontSize: "1.5rem",
    selectors: {
      "&:focus": {
        outline: "none",
        boxShadow: vars.shadows.medium,
      },
      "&:hover": {
        boxShadow: vars.shadows.medium,
      },
    },
    transition: "all 0.15s ease-in-out",
  },
]);

export const subscribeButton = style([
  sprinkles({}),
  {
    all: "unset",
    marginTop: "1.5rem",
    cursor: "pointer",
    padding: "0.8rem 1.2rem",
    borderRadius: "5px",
    boxShadow: vars.shadows.small,
    selectors: {
      "&:hover": {
        boxShadow: vars.shadows.medium,
      },
      "&:active": {
        boxShadow: vars.shadows.large,
      },
    },
    transition: "all 0.15s ease-in-out",
  },
]);

export const fakeInput = style({
  position: "absolute",
  top: "0",
  left: "-9999px",
  overflow: "hidden",
  visibility: "hidden",
  whiteSpace: "nowrap",
  height: "0",
  padding: "0.8rem 1.5rem",
  fontSize: "1.5rem",
});
