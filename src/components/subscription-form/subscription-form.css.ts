import { style, keyframes } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { card, largeText, normalText, vars } from "../styles.css";
import { row } from "../grid.css";

export const subscriptionForm = style([
  row,
  {
    marginTop: "0.5rem",
    display: "flex",
    textAlign: "center",
    alignSelf: "center",
  },
]);

export const subTitle = style([
  largeText,
  sprinkles({
    maxWidth: {
      sm: "100%",
      md: "100%",
      lg: "28rem",
    },
  }),
  {
    textAlign: "center",
    alignSelf: "center",
  },
]);

const subscribedPlaceholder = sprinkles({
  paddingY: {
    sm: "small",
    md: "medium",
  },
  paddingX: {
    sm: "medium",
    md: "large",
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
  },
});

export const subscribeInput = style([
  subscribedPlaceholder,
  card,
  normalText,
  sprinkles({
    flex: {
      sm: 1,
      md: 1,
      lg: "none",
    },
  }),
  {
    minWidth: "10rem",
    WebkitAppearance: "none",
    border: `1px solid ${vars.color.white}`,
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
      },
    },
  },
]);

// TODO: spinner is written ugly, fix it
export const subscribeButton = style([
  card,
  sprinkles({
    paddingY: {
      sm: "small",
      md: "medium",
    },
    paddingX: {
      sm: "medium",
      md: "large",
    },
  }),
  {
    fontSize: "1rem",
    backgroundColor: vars.color.white,
    border: "none",
    cursor: "pointer",
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
