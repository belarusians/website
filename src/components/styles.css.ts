import { createTheme, globalStyle, style } from "@vanilla-extract/css";
import { sprinkles } from "./sprinkles.css";

export const [themeClass, vars] = createTheme({
  color: {
    white: "#ffffff",
    red: "#ed1c24",
    darkRed: "#af0000",
    black: "#231f20",
    lightBlack: "#333333",
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

globalStyle("body", {
  color: vars.color.lightBlack,
  margin: 0,
});

globalStyle("html", {
  fontSize: "18px",
  overflowY: "scroll",
});

globalStyle("a:link, a:visited, button", {
  color: vars.color.lightBlack,
});

const grad1 = `radial-gradient(26.76% 85.52% at 86.73% -12.86%, ${vars.color.darkRed} 6.65%, transparent)`;
const grad2 = `radial-gradient(farthest-side at bottom left, ${vars.color.darkRed} 6.65%, ${vars.color.red} 100%)`;

export const beautifulGradient = style({
  background: `${grad1}, ${grad2}`,
});

export const darkBackground = style({
  backgroundColor: vars.color.grey,
  color: vars.color.white,
});

export const container = style([
  sprinkles({
    paddingX: {
      sm: "large",
      md: "large",
      lg: "extraLarge",
    },
  }),
  {
    maxWidth: "75rem",
    marginLeft: "auto",
    marginRight: "auto",
  },
]);

export const rounded = style({
  borderRadius: "5px",
});

export const roundedTop = style({
  borderRadius: "5px 5px 0 0",
});

export const roundedBottom = style({
  borderRadius: "0 0 5px 5px",
});

export const card = style([
  {
    boxShadow: vars.shadows.small,
    borderRadius: "5px",
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
      lg: "2rem",
    },
    marginBottom: {
      sm: "0.5rem",
      md: "0.5rem",
      lg: "0.5rem",
    },
  }),
  {
    fontWeight: 500,
    marginTop: 0,
  },
]);

export const centerSectionTitle = style([
  sectionTitle,
  {
    textAlign: "center",
  },
]);

export const largeText = style([
  sprinkles({
    fontSize: {
      sm: "1rem",
      md: "1.5rem",
      lg: "1.5rem",
    },
  }),
]);

export const normalText = style([
  sprinkles({
    fontSize: {
      sm: "1rem",
      md: "1rem",
      lg: "1rem",
    },
  }),
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
  },
]);

export const removeUnderline = style({
  textDecoration: "none",
});

export const toCenterAll = style([
  {
    display: "flex",
    selectors: {
      "&:last-child": {
        marginRight: "auto",
      },
      "&:first-child": {
        marginLeft: "auto",
      },
    },
  },
]);
