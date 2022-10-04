import { createTheme, style } from "@vanilla-extract/css";

export const [themeClass, vars] = createTheme({
  color: {
    white: "#ffffff",
    red: "#ed1b24",
    trueRed: "#cc0000",
    black: "#333333",
  },
  shadows: {
    small: "0 3px 6px 1px #9494944d",
    medium: "0 3px 6px 3px #9494944d",
    large: "0 3px 6px 5px #9494944d",
  },
});

export const card = style([
  {
    boxShadow: vars.shadows.small,
    borderRadius: "5px",
    transition: "all 0.15s ease-in-out",
  },
]);
