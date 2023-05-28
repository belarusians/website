import { style } from "@vanilla-extract/css";
import { shadowedElement, rounded } from "./common.styles.css";
import { sprinkles } from "./sprinkles.css";
import { fadeInElementOnScroll } from "../utils/animation.css";

export const aboutUs = style([
  sprinkles({
    display: {
      sm: "block",
      lg: "grid",
    },
    marginTop: {
      sm: "1rem",
      md: "2rem",
      lg: "4rem",
    },
  }),
  {
    gridTemplateRows: "20rem 15rem 15rem 20rem 20rem",
    gridTemplateColumns: "calc(25% - 1rem) calc(25% - 1rem) calc(25% - 1rem) 25%",
    columnGap: "1rem",
    rowGap: "2rem",
    gridTemplateAreas: `
    "who who whoImage whoImage"
    "whatImage what what what"
    "why why whyImage whyImage"
    "forMe forMe forMe forMeImage"
    "help helpImage helpImage helpImage"
  `,
  },
]);

export const image = style([
  sprinkles({
    display: {
      sm: "none",
      lg: "block",
    },
  }),
]);

export const who = style([
  fadeInElementOnScroll,
  {
    alignSelf: "center",
    gridArea: "who",
  },
]);
export const whoImage = style([
  shadowedElement,
  rounded,
  image,
  fadeInElementOnScroll,
  {
    position: "relative",
    gridArea: "whoImage",
  },
]);
export const why = style([
  fadeInElementOnScroll,
  {
    alignSelf: "center",
    gridArea: "why",
  },
]);
export const whyImage = style([
  image,
  shadowedElement,
  rounded,
  fadeInElementOnScroll,
  {
    position: "relative",
    gridArea: "whyImage",
  },
]);
export const what = style([
  fadeInElementOnScroll,
  {
    alignSelf: "center",
    gridArea: "what",
  },
]);
export const whatImage = style([
  fadeInElementOnScroll,
  image,
  shadowedElement,
  rounded,
  {
    position: "relative",
    gridArea: "whatImage",
  },
]);
export const forMe = style([
  fadeInElementOnScroll,
  {
    alignSelf: "center",
    gridArea: "forMe",
  },
]);
export const forMeImage = style([
  fadeInElementOnScroll,
  image,
  shadowedElement,
  rounded,
  {
    position: "relative",
    gridArea: "forMeImage",
  },
]);
export const help = style([
  fadeInElementOnScroll,
  {
    alignSelf: "center",
    gridArea: "help",
  },
]);
export const helpImage = style([
  image,
  shadowedElement,
  rounded,
  fadeInElementOnScroll,
  {
    position: "relative",
    gridArea: "helpImage",
  },
]);
