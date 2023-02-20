import { keyframes, style } from "@vanilla-extract/css";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../styles.css";

export const eventContainer = style([
  sprinkles({
    flexDirection: {
      sm: "column",
      md: "row",
      lg: "row",
    },
    paddingX: {
      sm: "large",
      md: "large",
      lg: "extraLarge",
    },
    paddingBottom: {
      sm: "large",
      md: "large",
      lg: "extraLarge",
    },
  }),
  {
    display: "flex",
    gap: "1rem",
    lineHeight: "1.5rem",
  },
]);

export const eventContent = style([
  sprinkles({
    flex: {
      sm: "100%",
      md: "70%",
      lg: "80%",
    },
  }),
]);

export const eventButtons = style([
  sprinkles({
    flex: {
      sm: "100%",
      md: "30%",
      lg: "20%",
    },
  }),
]);

const backgroundRotation = keyframes({
  "0%": {
    backgroundPosition: "0 0",
  },
  "100%": {
    backgroundPosition: "100% 0",
  },
});

const color = {
  first: "#ff1111",
  second: "#b40000",
  third: "#ff0000",
  fourth: "#af0000",
};

export const ticketButton = style([
  sprinkles({
    marginTop: {
      sm: "2rem",
      md: "1rem",
    },
    fontSize: {
      sm: "1rem",
      md: "1.2rem",
    },
  }),
  {
    width: "100%",
    color: vars.color.white,
    backgroundImage: `linear-gradient(60deg, ${color.first}, ${color.second}, ${color.third}, ${color.fourth}, ${color.first}, ${color.second}, ${color.third})`,
    animation: `${backgroundRotation} 4s infinite linear`,
    backgroundSize: "350% 100%",
  },
]);
