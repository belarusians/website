import { createTheme, globalStyle, style } from "@vanilla-extract/css";
import { sprinkles } from "./sprinkles.css";

export const [themeClass, vars] = createTheme({
  color: {
    white: "#ffffff",
    red: "#ed1b24",
    trueRed: "#cc0000",
    darkRed: "#af0000",
    black: "#333333",
    blackTransparent: "rgba(51,51,51,0.4)",
    grey: "grey",
  },
  shadows: {
    small: "0 3px 6px 1px #9494944d",
    medium: "0 3px 6px 3px #9494944d",
    large: "0 3px 6px 5px #9494944d",
    top: "rgba(0, 0, 0, 0.15) 0px 50px 15px -39px inset",
    bottom: "rgba(0, 0, 0, 0.15) 0px -50px 15px -39px inset",
  },
});

globalStyle("*", {
  fontFamily: "'Work Sans', sans-serif;",
  color: vars.color.black,
});

globalStyle("body", {
  margin: 0,
});

const grad1 = `radial-gradient(26.76% 85.52% at 86.73% -12.86%, ${vars.color.darkRed} 6.65%, transparent)`;
const grad2 = `radial-gradient(farthest-side at bottom left, ${vars.color.darkRed} 6.65%, ${vars.color.red} 100%)`;

export const beautifulGradient = style({
  background: `${grad1}, ${grad2}`,
});

export const container = style([
  sprinkles({
    paddingX: {
      sm: "large",
      md: "extraLarge",
    },
  }),
  {
    maxWidth: "80rem",
    marginLeft: "auto",
    marginRight: "auto",
  }
]);

export const card = style([
  {
    boxShadow: vars.shadows.small,
    borderRadius: "5px",
    transition: "all 0.15s ease-in-out",
    backgroundColor: vars.color.white,
  },
]);

export const animatedCard = style([
  card,
  {
    selectors: {
      "&:hover": {
        boxShadow: vars.shadows.large,
        transform: "scale(1.01)",
      },
    },
    transition: "all 0.15s ease-in-out",
  },
]);

export const sectionTitle = style([
  sprinkles({
    fontSize: {
      sm: "1.5rem",
      md: "1.5rem",
      lg: "2.5rem",
    },
    marginBottom: {
      sm: "0.5rem",
      md: "0.5rem",
      lg: "0.5rem",
    }
  }),
  {
    fontWeight: 600,
  },
]);

export const largeText = style([
  sprinkles({
    fontSize: {
      sm: "1rem",
      md: "1.5rem",
      lg: "1.5rem",
    },
  })
]);

export const normalText = style([
  sprinkles({
    fontSize: {
      sm: "1rem",
      md: "1rem",
      lg: "1rem",
    },
  })
]);

export const smallText = style([
  sprinkles({
    fontSize: {
      sm: "0.6rem",
      md: "0.8rem",
      lg: "0.8rem",
    },
  }),
  {
    fontWeight: 300,
  }
]);
