import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const padding = {
  extraSmall: "10px",
  small: "40px",
  medium: "80px",
  large: "160px",
  extraLarge: "400px",
};

const responsiveProperties = defineProperties({
  conditions: {
    xs: {},
    sm: { "@media": "screen and (min-width: 768px)" },
    md: { "@media": "screen and (min-width: 1200px)" },
    lg: { "@media": "screen and (min-width: 1400px)" },
    xl: { "@media": "screen and (min-width: 2000px)" },
  },
  defaultCondition: "lg",
  properties: {
    display: ["none", "flex", "block"],
    flexDirection: ["row", "column"],
    justifyContent: [
      "stretch",
      "flex-start",
      "center",
      "flex-end",
      "space-around",
      "space-between",
    ],
    alignItems: ["stretch", "flex-start", "center", "flex-end"],
    paddingTop: padding,
    paddingBottom: padding,
    paddingLeft: padding,
    paddingRight: padding,
    height: ["auto", "50px", "100px", "200px", "300px"],
    width: ["auto", "50px", "100px", "200px", "300px"],
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    placeItems: ["justifyContent", "alignItems"],
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
