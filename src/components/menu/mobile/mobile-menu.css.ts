import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const hamburgerLines = style([
  {
    height: "26px",
    width: "32px",
    cursor: "pointer",
    top: "17px",
    left: "20px",
    zIndex: "100",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
]);

export const line = style([
  {
    boxShadow: vars.shadows.small,
    display: "block",
    height: "4px",
    width: "100%",
    borderRadius: "10px",
    selectors: {
      [`${hamburgerLines}:hover &`]: {
        boxShadow: vars.shadows.large,
      },
    },
  },
]);

export const line1 = style([
  line,
  {
    transformOrigin: "0% 0%",
    transition: "transform 0.4s ease-in-out",
    background: vars.color.white,
  },
]);

export const openedLine1 = style([
  line1,
  {
    transform: "rotate(45deg)",
  },
]);

export const line2 = style([
  line,
  {
    transition: "transform 0.2s ease-in-out",
    background: vars.color.red,
  },
]);

export const openedLine2 = style([
  line2,
  {
    transform: "scaleY(0)",
  },
]);

export const line3 = style([
  line,
  {
    transformOrigin: "0% 100%",
    transition: "transform 0.4s ease-in-out",
    background: vars.color.white,
  },
]);

export const openedLine3 = style([
  line3,
  {
    transform: "rotate(-45deg)",
  },
]);

export const menuList = style({
  position: "absolute",
  top: "62px",
  left: 0,
  display: "flex",
  width: "100%",
  flexDirection: "column",
  backgroundColor: vars.color.red,
  zIndex: 100,
  paddingTop: "1rem",
  paddingBottom: "1rem",
});

export const menuItem = style({
  fontSize: "1.5rem",
  color: vars.color.white,
  paddingTop: "1rem",
  paddingBottom: "1rem",
  alignSelf: "center",
  borderStyle: "none none solid none",
  borderWidth: "1px",
  borderColor: vars.color.white,
  selectors: {
    "&:first-child": {
      borderBottom: "none",
    },
    "&:last-child": {
      borderBottom: "none",
    },
  },
});
