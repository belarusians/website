import { style } from "@vanilla-extract/css";
import { shadowedElement } from "../common.styles.css";
import { vars } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const pageControlsButton = style({
  height: "40px",
  width: "40px",
  backgroundColor: vars.color.white,
  border: 0,
  cursor: "pointer",
  transition: "all ease-in-out 0.1s",
  selectors: {
    "&:first-child": {
      borderRadius: "5px 0 0 5px",
      marginRight: "5px",
    },
    "&:last-child": {
      borderRadius: "0 5px 5px 0",
      marginLeft: "5px",
    },
  },
});

export const documentWrapper = style([
  sprinkles({
    marginTop: {
      sm: "0.5rem",
      md: "1rem",
    },
  }),
  {
    display: "flex",
  },
]);

export const pageControls = style([
  sprinkles({
    opacity: {
      sm: 1,
      md: 0,
      lg: 0,
    },
  }),
  shadowedElement,
  {
    transition: "all ease-in-out 0.2s",
    opacity: 0,
    backgroundColor: vars.color.white,
    position: "fixed",
    bottom: "20%",
    left: "50%",
    transform: "translate(-50%)",
    selectors: {
      [`${documentWrapper}:hover &`]: {
        opacity: 1,
      },
      ["&:hover"]: {
        boxShadow: vars.shadows.medium,
      },
    },
  },
]);

export const doc = style([
  shadowedElement,
  {
    marginLeft: "auto",
    marginRight: "auto",
  },
]);

export const placeholder = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: `100vh`,
  height: "80vh",
});
