import { style } from "@vanilla-extract/css";
import { vars } from "../styles.css";
import { sprinkles } from "../sprinkles.css";

export const logo = style({
  fill: vars.color.red,
});

export const bottomText = style([
  sprinkles({
    display: {
      sm: "none",
    }
  }),
  {
  fill: vars.color.black,
}]);

export const mainText = style([
  logo
]);
