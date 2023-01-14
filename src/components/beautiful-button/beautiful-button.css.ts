import { keyframes, style } from "@vanilla-extract/css";
import { responsiveButton } from "../common.styles.css";
import { vars } from "../styles.css";

const wobble = keyframes({
  "0%": {
    borderRadius: "15px 40px 20px 40px",
  },
  "20%": {
    borderRadius: "40px 15px 40px 20px",
  },
  "40%": {
    borderRadius: "50% 50% 40% 40%",
  },
  "60%": {
    borderRadius: "40px 20px 40px 20px",
  },
  "80%": {
    borderRadius: "30px 40% 50% 50%",
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
  first: "#ee2fe3",
  second: "#ac28e1",
  third: "#1198b7",
  fourth: "#0cb655",
  fifth: "#b0b60c",
};

export const beautifulButton = style([
  responsiveButton,
  {
    color: vars.color.white,
    backgroundImage: `linear-gradient(60deg, ${color.first}, ${color.second}, ${color.third}, ${color.fourth}, ${color.fifth}, ${color.first}, ${color.second}, ${color.third})`,
    animation: `${backgroundRotation} 4s infinite linear, ${wobble} 5s ease-in-out alternate infinite`,
    backgroundSize: "400% 100%",
  },
]);
