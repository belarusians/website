import { style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const title = style([
  sprinkles({
    fontSize: {
      sm: "1.5rem",
      md: "2rem",
      lg: "2.5rem",
    }
  }),
  {
    bottom: "0.5rem",
    left: "1rem",
    position: "absolute",
    textTransform: "uppercase",
    textShadow: "-1px 0px red, 1px 0px red, 0px 1px red, 0px -1px red",
    color: vars.color.white,
  },
]);

export const image = style([{
  borderRadius: "5px",
}]);

export const thumbnail = style([sprinkles({

}), {
  position: "relative",
  height: "100%",
  width: "100%",
  selectors: {
    "&:hover": {
      boxShadow: vars.shadows.medium,
      transform: "scale(1.01)",
    },
  },
  transition: "all 0.15s ease-in-out",
}]);
