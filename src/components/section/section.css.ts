import { style } from "@vanilla-extract/css";
import { sprinkles, vars } from "../sprinkles.css";

export const section = style([
  sprinkles({
    padding: {
      xs: "extraSmall",
      sm: "small",
      md: "large",
      lg: "extraLarge",
    }
  }), {
    marginTop: "40px",
    boxShadow: vars.shadows.small,
    borderRadius: "5px",
},]);