import { style, keyframes } from "@vanilla-extract/css";
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
    border: `1px solid ${vars.color.white}`,
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
      "&.invalid": {
        border: `1px solid ${vars.color.red}`,
      },
    },
    transition: "all 0.15s ease-in-out",
  },
]);

// TODO: spinner is written ugly, fix it
export const subscribeButton = style([
  sprinkles({}),
  {
    all: "unset",
    marginTop: "1.5rem",
    cursor: "pointer",
    padding: "0.8rem 1rem",
    borderRadius: "5px",
    boxShadow: vars.shadows.small,
    selectors: {
      "&:hover": {
        boxShadow: vars.shadows.medium,
      },
      "&:active": {
        boxShadow: vars.shadows.large,
      },
      "&.loading": {
        paddingLeft: "2.5rem",
      },
    },
    transition: "all 0.15s ease-in-out",
  },
]);

export const subscribeStatus = style({});

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
  marginLeft: "-1.5rem",
  marginRight: "1rem",
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
