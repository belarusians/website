import { keyframes, style } from "@vanilla-extract/css";
import { card, rounded, vars } from "./styles.css";
import { sprinkles } from "./sprinkles.css";

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
  animation: `${fadeIn} .6s ease-in-out`,
  animationFillMode: "forwards",
});

export const sectionHeading = style([
  animationFadeIn,
  sprinkles({
    fontSize: {
      sm: "1.2rem",
    },
  }),
]);

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
  {
    opacity: 0,
    alignSelf: "center",
    gridArea: "who",
  },
]);
export const whoImage = style([
  card,
  rounded,
  image,
  {
    opacity: 0,
    position: "relative",
    gridArea: "whoImage",
  },
]);
export const why = style([
  {
    opacity: 0,
    alignSelf: "center",
    gridArea: "why",
  },
]);
export const whyImage = style([
  image,
  card,
  rounded,
  {
    opacity: 0,
    position: "relative",
    gridArea: "whyImage",
  },
]);
export const what = style([
  {
    opacity: 0,
    alignSelf: "center",
    gridArea: "what",
  },
]);
export const whatImage = style([
  image,
  card,
  rounded,
  {
    opacity: 0,
    position: "relative",
    gridArea: "whatImage",
  },
]);
export const forMe = style([
  {
    opacity: 0,
    alignSelf: "center",
    gridArea: "forMe",
  },
]);
export const forMeImage = style([
  image,
  card,
  rounded,
  {
    opacity: 0,
    position: "relative",
    gridArea: "forMeImage",
  },
]);
export const help = style([
  {
    opacity: 0,
    alignSelf: "center",
    gridArea: "help",
  },
]);
export const helpImage = style([
  image,
  card,
  rounded,
  {
    opacity: 0,
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
  {
    position: "relative",
    width: "12rem",
    height: "4rem",
  },
]);

export const mfb = style([
  {
    position: "relative",
    width: "5rem",
    height: "5rem",
  },
]);

export const partnersHeading = style({
  marginTop: "3rem",
  textAlign: "center",
  fontWeight: 300,
});
