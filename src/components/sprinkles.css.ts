import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { vars } from "./styles.css";

// TODO: need to think about better way for paddings. Looks like these shortcuts are making styles unreadable
const padding = {
  extraSmall: "0.28rem",
  small: "0.55rem",
  medium: "0.75rem",
  large: "0.9rem",
  extraLarge: "1.8rem",
  ["1rem"]: "1rem",
  ["2rem"]: "2rem",
  [0]: "0",
  ["0.5rem"]: "0.5rem",
};

const margin = [0, "0.3rem", "0.5rem", "1rem", "1.5rem", "2rem", "4rem"];

export const mobileStartsFrom = 768;

const responsiveProperties = defineProperties({
  conditions: {
    sm: { "@media": `screen and (max-width: ${mobileStartsFrom - 1}px)` },
    md: { "@media": `screen and (min-width: ${mobileStartsFrom}px)` },
    lg: { "@media": "screen and (min-width: 1024px)" },
  },
  defaultCondition: "lg",
  properties: {
    display: ["none", "flex", "grid", "block"],
    flexDirection: ["row", "column"],
    flexGrow: [0, 1, 2],
    flexBasis: ["7rem", "9rem", "18rem", "30%"],
    flex: [1, "none"],
    maxWidth: ["28rem", "100%"],
    minWidth: ["18rem"],
    paddingTop: padding,
    paddingBottom: padding,
    paddingLeft: padding,
    paddingRight: padding,
    marginTop: margin,
    marginBottom: margin,
    marginLeft: margin,
    marginRight: margin,
    height: ["1rem", "2rem", "3rem", "4rem", "5rem", "9rem", "18rem"],
    width: ["1rem", "2rem", "3rem", "4rem", "5rem", "7rem", "9rem", "12rem", "14rem", "23rem"],
    fontSize: ["0.6rem", "0.8rem", "1rem", "1.2rem", "1.5rem", "2rem", "2.5rem", "3rem", "5rem"],
    position: ["sticky"],
    boxShadow: [...Object.values(vars.shadows), "none"],
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
