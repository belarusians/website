import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const hamburgerLines = style([
  {
    height: "24px",
    width: "32px",
    cursor: "pointer",
    top: "17px",
    left: "20px",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
]);

export const joinUsButton = style({
  marginRight: "1rem",
});

export const line = style([
  {
    display: "block",
    height: "8px",
    width: "100%",
    borderRadius: "2px",
    background: vars.color.white,
  },
]);

export const line1 = style([
  line,
  {
    transformOrigin: "6px 6px",
    transition: "transform 0.4s ease-in-out",
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
    transformOrigin: "5px 1px",
    transition: "transform 0.4s ease-in-out",
  },
]);

export const openedLine2 = style([
  line2,
  {
    transform: "rotate(-45deg)",
  },
]);

export const menu = style({
  display: "flex",
  alignItems: "center",
});

export const menuList = style({
  position: "absolute",
  top: "60px",
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
  textDecoration: "none",
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
