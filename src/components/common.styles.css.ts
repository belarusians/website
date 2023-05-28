import { style } from "@vanilla-extract/css";
import { vars } from "./styles.css";

const grad1 = `radial-gradient(26.76% 85.52% at 86.73% -12.86%, ${vars.color.darkRed} 6.65%, transparent)`;
const grad2 = `radial-gradient(farthest-side at bottom left, ${vars.color.darkRed} 6.65%, ${vars.color.red} 100%)`;

export const beautifulGradient = style({
  background: `${grad1}, ${grad2}`,
  lineHeight: "normal",
});

export const rounded = style({
  borderRadius: "5px",
});

export const roundedTop = style({
  borderRadius: "5px 5px 0 0",
});

export const shadowedElement = style([
  {
    boxShadow: vars.shadows.small,
    borderRadius: "5px",
  },
]);
