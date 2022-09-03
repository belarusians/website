import { createTheme } from "@vanilla-extract/css";
import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const padding = {
  none: "0",
  extraSmall: "0.3rem",
  small: "0.6rem",
  medium: "0.8rem",
  large: "1rem",
  extraLarge: "1.2rem",
  // @deprecated
  smallOld: "20px",
  mediumOld: "40px",
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
    marginTop: [0, "5px", "10px"],
    marginLeft: [0, "0.5rem", "1rem", "2rem"],
    height: ["auto", "30px", "50px", "70px", "100px", "150px", "200px"],
    minHeight: ["auto", "30px", "50px", "70px", "100px", "150px", "200px"],
    width: ["auto", "0.5rem", "1rem", "2rem",  "52px", "87px", "173px", "260px", "300px"],
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
    white: "#ffffff",
    red: "#ed1b24",
    trueRed: "#cc0000",
    black: "#333333",
  },
  shadows: {
    small: "0 3px 6px 1px #9494944d",
    medium: "0 3px 6px 3px #9494944d",
    large: "0 3px 6px 5px #9494944d",
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
