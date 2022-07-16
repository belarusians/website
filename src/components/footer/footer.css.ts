import { style } from "@vanilla-extract/css";
import { sprinkles, vars } from "../sprinkles.css";

export const footer = style([sprinkles({
  fontSize: {
    xs: "0.6rem",
    sm: "1rem",
  }
}),{
  paddingTop: "2rem",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
}]);

export const github = style([sprinkles({
  marginLeft: {
    xs: "0.5rem",
    sm: "1rem",
  },
}), {
  fill: vars.color.black,
  selectors: {
    "&:hover": {
      fill: vars.color.red
    }
  },
  transition: "all 0.15s ease-in-out",
}]);

export const githubIcon = style([sprinkles({
  width: {
    xs: "1rem",
    sm: "2rem",
  }
})]);

export const disclaimer = style([{
  fontWeight: 300,
}]);