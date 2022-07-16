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

const subscribedPlaceholder = sprinkles({
  fontSize: {
    xs: "0.8rem",
    sm: "1.5rem",
  },
  paddingY: {
    xs: "small",
    sm: "medium",
  },
  paddingX: {
    xs: "medium",
    sm: "large",
  },
});

export const success = style([subscribedPlaceholder]);

const shake = keyframes({
  "0%": {
    transform: "translateX(0)",
  },
  "25%": {
    transform: "translateX(5px)",
  },
  "50%": {
    transform: "translateX(-5px)",
  },
  "75%": {
    transform: "translateX(5px)",
  },
  "100%": {
    transform: "translateX(0)",
  }
});

export const subscribeInput = style([
  subscribedPlaceholder,
  {
    WebkitAppearance: "none",
    textAlign: "center",
    minWidth: "15rem",
    border: `1px solid ${vars.color.white}`,
    borderRadius: "5px",
    boxShadow: vars.shadows.small,
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
      "&.shake": {
        position: "relative",
        animation: `${shake} .6s ease-in-out`,
        animationIterationCount: 2,
      }
    },
    transition: "all 0.15s ease-in-out",
  },
]);

// TODO: spinner is written ugly, fix it
export const subscribeButton = style([
  sprinkles({
    paddingY: {
      xs: "small",
      sm: "medium",
    },
    paddingX: {
      xs: "medium",
      sm: "large",
    },
  }),
  {
    fontSize: "1rem",
    backgroundColor: vars.color.white,
    border: "none",
    marginTop: "1.5rem",
    cursor: "pointer",
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