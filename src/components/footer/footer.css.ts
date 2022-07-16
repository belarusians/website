import { style } from "@vanilla-extract/css";
import { vars } from "../sprinkles.css";

export const footer = style([{
  paddingTop: "2rem",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
}]);

export const github = style([{
  marginLeft: "1rem",
  fill: vars.color.black,
  selectors: {
    "&:hover": {
      fill: vars.color.red
    }
  },
  transition: "all 0.15s ease-in-out",
}]);

export const disclaimer = style([{
  fontWeight: 300,
}]);