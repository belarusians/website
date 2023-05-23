import { style } from "@vanilla-extract/css";
import { vars } from "./styles.css";
import { sprinkles } from "./sprinkles.css";

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
    maxWidth: "65rem",
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

export const shadowedElement = style([
  {
    boxShadow: vars.shadows.small,
    borderRadius: "5px",
  },
]);

/**
 * @deprecated
 */
export const removeUnderline = style({
  textDecoration: "none",
});

export const animatedCard = style([
  shadowedElement,
  {
    transition: "all 0.15s ease-in-out",
    selectors: {
      "&:hover": {
        boxShadow: vars.shadows.large,
        transform: "scale(1.01)",
      },
    },
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

export const flexToRight = style({
  marginLeft: "auto",
});

export const flexToLeft = style({
  marginRight: "auto",
});
