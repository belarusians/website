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
  paddingBottom: "0.5rem",
}]);

export const link = style([
  sprinkles({
    marginRight: {
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
    }
  }), {
  selectors: {
    "&:hover": {
      color: vars.color.red
    }
  },
  transition: "all 0.15s ease-in-out",
}]);

export const icon = style([sprinkles({
  fontSize: {
    sm: "1.5rem",
    md: "1.5rem",
    lg: "2rem",
  }
}), {
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
