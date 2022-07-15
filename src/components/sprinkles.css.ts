import { createTheme } from "@vanilla-extract/css";
import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const padding = {
  extraSmallButton: "5px",
  smallButton: "10px",
  none: "0",
  small: "20px",
  medium: "40px",
  large: "80px",
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
    marginTop: [0, "10px"],
    height: ["auto", "30px", "50px", "70px", "100px", "150px", "200px"],
    minHeight: ["auto", "30px", "50px", "70px", "100px", "150px", "200px"],
    width: ["auto", "52px", "87px", "173px", "260px", "300px"],
    minWidth: ["auto", "52px", "87px", "173px", "260px", "300px"],
    fontSize: ["0.6rem", "0.8rem", "1rem", "1.2rem", "1.5rem", "2rem", "3rem"],
    maxWidth: ["75rem", "100rem", "150rem"],
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    placeItems: ["justifyContent", "alignItems"],
  },
});

export const [themeClass, vars] = createTheme({
  color: {
    red: "#ff0000",
  },
  shadows: {
    small: "0 3px 6px 1px #9494944d",
    medium: "0 3px 6px 3px #9494944d",
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
