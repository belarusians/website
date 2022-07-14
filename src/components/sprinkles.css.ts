import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const padding = {
  none: "0",
  small: "40px",
  medium: "80px",
  large: "160px",
};

const responsiveProperties = defineProperties({
  conditions: {
    xs: {},
    sm: { "@media": "screen and (min-width: 768px)" },
    md: { "@media": "screen and (min-width: 1024px)" },
    lg: { "@media": "screen and (min-width: 1400px)" },
    xl: { "@media": "screen and (min-width: 2000px)" },
  },
  defaultCondition: "lg",
  properties: {
    display: ["none", "flex", "block"],
    flexDirection: ["row", "column"],
    justifyContent: ["stretch", "flex-start", "center", "flex-end", "space-around", "space-between"],
    alignItems: ["stretch", "flex-start", "center", "flex-end"],
    paddingTop: padding,
    paddingBottom: padding,
    paddingLeft: padding,
    paddingRight: padding,
    height: ["auto", "50px", "100px", "150px", "200px", "300px"],
    width: ["auto", "87px", "173px", "200px", "260px", "300px"],
    fontSize: ["1rem", "1.2rem", "1.5rem", "2rem", "3rem"],
    maxWidth: ["75rem", "100rem", "150rem"],
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    placeItems: ["justifyContent", "alignItems"],
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
