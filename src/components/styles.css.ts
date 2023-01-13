import { createTheme, globalStyle } from "@vanilla-extract/css";

export const [themeClass, vars] = createTheme({
  color: {
    white: "#ffffff",
    red: "#ed1c24",
    darkRed: "#af0000",
    black: "#231f20",
    lightBlack: "#333333",
    blackTransparent: "rgba(51,51,51,0.4)",
    grey: "grey",
  },
  shadows: {
    small: "0 3px 6px 1px #9494944d",
    medium: "0 3px 6px 3px #9494944d",
    large: "0 3px 6px 5px #9494944d",
    top: "rgba(0, 0, 0, 0.15) 0px 50px 15px -39px inset",
    bottom: "rgba(0, 0, 0, 0.15) 0px -50px 15px -39px inset",
  },
});

globalStyle("body", {
  color: vars.color.lightBlack,
  margin: 0,
});

globalStyle("html", {
  fontSize: "18px",
  overflowY: "scroll",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});
