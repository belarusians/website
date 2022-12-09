import { keyframes, style } from "@vanilla-extract/css";

const fadeIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(50px)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const animationFadeIn = style({
  animation: `${fadeIn} .5s ease-in-out`,
  animationFillMode: "forwards",
});

export const fadeInElementOnScroll = style({
  opacity: 0,
});
