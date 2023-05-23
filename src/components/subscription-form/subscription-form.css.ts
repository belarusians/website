import { style, keyframes } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";
import { shadowedElement, largeText, normalText, toCenterAll } from "../common.styles.css";
import { row } from "../grid.css";

export const subscriptionForm = style([
  row,
  {
    marginTop: "0.5rem",
    display: "flex",
    width: "100%",
    textAlign: "center",
    alignSelf: "center",
  },
]);

export const subTitle = style([
  largeText,
  sprinkles({
    maxWidth: {
      sm: "100%",
      lg: "28rem",
    },
  }),
  {
    textAlign: "center",
    alignSelf: "center",
  },
]);

const subscribedPlaceholder = style([
  toCenterAll,
  sprinkles({
    paddingY: {
      sm: "small",
      md: "medium",
    },
    paddingX: {
      sm: "medium",
      md: "large",
    },
    flexGrow: {
      sm: 1,
      lg: 0,
    },
    flexBasis: {
      lg: "30%",
    },
  }),
  {
    selectors: {
      "&.hide": {
        display: "none",
      },
      "&.show": {
        display: "initial",
      },
    },
  },
]);

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
  shadowedElement,
  normalText,
  {
    minWidth: "0px", // disabling default width on HTML input element
    WebkitAppearance: "none",
    border: `1px solid ${vars.color.white}`,
    marginLeft: "auto",
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

export const subscribeButton = style({
  marginRight: "auto",
});
