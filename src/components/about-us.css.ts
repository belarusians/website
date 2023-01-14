import { style } from "@vanilla-extract/css";
import { vars } from "./styles.css";
import { card, rounded } from "./common.styles.css";
import { sprinkles } from "./sprinkles.css";
import { fadeInElementOnScroll } from "../utils/animation.css";

export const heading = style([
  {
    color: vars.color.red,
  },
  sprinkles({
    fontSize: {
      sm: "1.2rem",
    },
  }),
]);

export const aboutUs = style([
  sprinkles({
    display: {
      sm: "block",
      md: "block",
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
    "why why why whyImage"
    "forMe forMe forMeImage forMeImage"
    "help helpImage helpImage helpImage"
  `,
  },
]);

export const image = style([
  sprinkles({
    display: {
      sm: "none",
      md: "none",
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
  card,
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
  card,
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
  card,
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
  card,
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
  card,
  rounded,
  fadeInElementOnScroll,
  {
    position: "relative",
    gridArea: "helpImage",
  },
]);

export const fit = style([
  rounded,
  {
    objectFit: "cover",
  },
]);

export const partnerLogo = style({
  objectFit: "contain",
});

export const partners = style([
  {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: "auto",
    marginRight: "auto",
    gap: "2rem",
  },
]);

export const libereco = style([
  sprinkles({
    width: {
      sm: "9rem",
      md: "12rem",
      lg: "12rem",
    },
    height: {
      sm: "3rem",
      md: "4rem",
      lg: "4rem",
    },
  }),
  {
    position: "relative",
  },
]);

export const mfb = style([
  sprinkles({
    width: {
      sm: "3rem",
      md: "5rem",
      lg: "5rem",
    },
    height: {
      sm: "3rem",
      md: "5rem",
      lg: "5rem",
    },
  }),
  {
    position: "relative",
  },
]);

export const partnersHeading = style([
  sprinkles({
    marginTop: {
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
    },
    fontSize: {
      sm: "1.5rem",
    },
  }),
  {
    textAlign: "center",
    fontWeight: 300,
  },
]);
