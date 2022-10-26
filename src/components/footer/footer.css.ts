import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const footer = style([
  sprinkles({
  fontSize: {
    sm: "0.6rem",
    md: "1rem",
  }
}),{
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
}]);

export const link = style({
  marginRight: "1.5rem",
  selectors: {
    "&:hover": {
      color: vars.color.red
    }
  },
  transition: "all 0.15s ease-in-out",
});

export const icon = style([sprinkles({
  fontSize: {
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
  }
}), {
  color: vars.color.white, // TODO: this has to come from parent styles
  selectors: {
    "&:hover": {
      color: vars.color.red
    }
  },
  transition: "all 0.15s ease-in-out",
}]);

export const disclaimer = style([{
  fontSize: "0.8rem",
  fontWeight: 300,
  letterSpacing: ".045em",
  marginLeft: "auto",
}]);
