import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const footer = style([sprinkles({
  fontSize: {
    sm: "0.6rem",
    md: "1rem",
  }
}),{
  paddingTop: "2rem",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
}]);

export const github = style([sprinkles({
  marginLeft: {
    sm: "0.5rem",
    md: "1rem",
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
    sm: "1rem",
    md: "2rem",
  }
})]);

export const disclaimer = style([{
  fontWeight: 300,
}]);