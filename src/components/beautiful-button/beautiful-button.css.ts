import { keyframes, style } from "@vanilla-extract/css";
import { responsiveButton } from "../common.styles.css";
import { vars } from "../styles.css";

const wobble = keyframes({
  "50%": {
    borderRadius: "20px 12px 8px 20px",
  },
  "100%": {
    borderRadius: "20px 5px 20px 5px",
  },
});

const backgroundRotation = keyframes({
  "0%": {
    backgroundPosition: "0 0",
  },
  "100%": {
    backgroundPosition: "100% 0",
  },
});

const color = {
  first: "#f237ff",
  second: "#b82cef",
  third: "#15b4d9",
  fourth: "#0cb655",
  fifth: "#b0b60c",
};

export const beautifulButton = style([
  responsiveButton,
  {
    color: vars.color.white,
    backgroundImage: `linear-gradient(60deg, ${color.first}, ${color.second}, ${color.third}, ${color.fourth}, ${color.fifth}, ${color.first}, ${color.second}, ${color.third})`,
    borderRadius: "5px 20px 5px 20px",
    animation: `${backgroundRotation} 3s infinite linear, ${wobble} 0.5s ease-in-out alternate infinite`,
    backgroundSize: "400% 100%",
  },
]);
