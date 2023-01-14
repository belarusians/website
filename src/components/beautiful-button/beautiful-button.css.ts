import { keyframes, style } from "@vanilla-extract/css";
import { responsiveButton } from "../common.styles.css";
import { vars } from "../styles.css";

const wobble = keyframes({
  "0%": {
    borderRadius: "15px 40px 20px 40px",
  },
  "25%": {
    borderRadius: "40px 15px 40px 20px",
  },
  "50%": {
    borderRadius: "20px 40px 15px 40px",
  },
  "75%": {
    borderRadius: "40px 20px 40px 15px",
  },
  "100%": {
    borderRadius: "15px 40px 20px 40px",
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
    animation: `${backgroundRotation} 3s infinite linear, ${wobble} 1s ease-in-out alternate infinite`,
    backgroundSize: "400% 100%",
  },
]);
