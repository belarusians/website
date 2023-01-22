import { keyframes, style } from "@vanilla-extract/css";
import { responsiveButton } from "../common.styles.css";
import { vars } from "../styles.css";

const wobble = keyframes({
  "0%": {
    borderRadius: "10px 30px 15px 30px",
  },
  "20%": {
    borderRadius: "30px 10px 30px 15px",
  },
  "40%": {
    borderRadius: "30% 30% 20% 20%",
  },
  "60%": {
    borderRadius: "30px 15px 30px 15px",
  },
  "80%": {
    borderRadius: "30px 20% 30% 30%",
  },
  "100%": {
    borderRadius: "10px 30px 15px 30px",
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
  first: "#ac28e1",
  second: "#4128e1",
  third: "#1198b7",
  fourth: "#0cb697",
};

export const beautifulButton = style([
  responsiveButton,
  {
    color: vars.color.white,
    textDecoration: "none",
    backgroundImage: `linear-gradient(60deg, ${color.first}, ${color.second}, ${color.third}, ${color.fourth}, ${color.first}, ${color.second}, ${color.third})`,
    animation: `${backgroundRotation} 4s infinite linear, ${wobble} 5s ease-in-out alternate infinite`,
    backgroundSize: "350% 100%",
  },
]);
