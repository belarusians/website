import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const padding = {
  extraSmall: "0.3rem",
  small: "0.6rem",
  medium: "0.8rem",
  large: "1rem",
  extraLarge: "2rem",
};

const responsiveProperties = defineProperties({
  conditions: {
    sm: { "@media": "screen and (max-width: 767px)" },
    md: { "@media": "screen and (min-width: 768px)" },
    lg: { "@media": "screen and (min-width: 1024px)" },
  },
  defaultCondition: "lg",
  properties: {
    flexDirection: ["row", "column"],
    flexGrow: [1, 2],
    flexBasis: ["10rem", "15rem", "20rem"],
    flex: [1, 2, 3, "none"],
    alignItems: ["stretch", "flex-start", "center", "flex-end"],
    maxWidth: ["30rem", "100%"],
    minWidth: ["20rem"],
    paddingTop: padding,
    paddingBottom: padding,
    paddingLeft: padding,
    paddingRight: padding,
    marginTop: [0, "0.5rem", "1rem", "2rem"],
    marginBottom: [0, "0.5rem", "1rem", "2rem"],
    marginLeft: [0, "0.5rem", "1rem", "2rem"],
    height: ["auto", "30px", "50px", "70px", "100px", "150px", "200px"],
    width: ["1rem", "2rem", "87px", "173px", "260px"],
    fontSize: ["0.6rem", "0.8rem", "1rem", "1.2rem", "1.5rem", "2rem", "2.5rem"],
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
