const redColor = {
  first: "#ff1111",
  second: "#b40000",
  third: "#ff0000",
  fourth: "#af0000",
};

const beautifulButtonColors = [
  {
    first: "#e1bc28",
    second: "#28e14d",
    third: "#115eb7",
    fourth: "#720cb6",
  },
  {
    first: "#e12828",
    second: "#e12897",
    third: "#b78811",
    fourth: "#0c2eb6",
  },
  {
    first: "#2885e1",
    second: "#28e163",
    third: "#11b727",
    fourth: "#0c2eb6",
  },
  {
    first: "#ac28e1",
    second: "#4128e1",
    third: "#1198b7",
    fourth: "#0cb697",
  },
];

const beautifulButtonColor = beautifulButtonColors[Math.floor(Math.random() * beautifulButtonColors.length)];

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      red: "#ed1c24",
      "red-shade": "#af0000",
      white: "#ffffff",
      "white-shade": "#fbfbfb",
      black: "#231f20",
      "black-tint": "#333333",
      grey: "rgb(128, 128, 128)",
      "light-grey": "rgb(217,217,217)",
    },
    container: {
      center: true,
    },
    fontFamily: {},
    extend: {
      backgroundImage: {
        "white-gradient": "linear-gradient(to top, rgba(255,255,255,255), rgba(255,255,255,0))",
        "beautiful-gradient":
          "radial-gradient(26.76% 85.52% at 86.73% -12.86%, #af0000 6.65%, transparent), radial-gradient(farthest-side at bottom left, #af0000 6.65%, #ed1c24 100%)",
        "beautiful-button": `linear-gradient(60deg, ${beautifulButtonColor.first}, ${beautifulButtonColor.second}, ${beautifulButtonColor.third}, ${beautifulButtonColor.fourth}, ${beautifulButtonColor.first}, ${beautifulButtonColor.second}, ${beautifulButtonColor.third})`,
        "red-gradient": `linear-gradient(60deg, ${redColor.first}, ${redColor.second}, ${redColor.third}, ${redColor.fourth}, ${redColor.first}, ${redColor.second}, ${redColor.third})`,
      },
      scale: {
        101: "1.01",
      },
      keyframes: {
        shake: {
          "0%": {
            transform: "translateX(0)",
          },
          "25%": {
            transform: "translateX(5px)",
          },
          "50%": {
            transform: "translateX(-5px)",
          },
          "75%": {
            transform: "translateX(5px)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: 0,
            transform: "translateY(50px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        wobble: {
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
        },
        backgroundRotation: {
          "0%": {
            backgroundPosition: "0 0",
          },
          "100%": {
            backgroundPosition: "100% 0",
          },
        },
      },
      animation: {
        shake: "shake .6s ease-in-out 1",
        "fade-in": "fade-in .5s ease-in-out forwards",
        "beautiful-button": "wobble 6s ease-in-out alternate infinite, backgroundRotation 5s infinite linear",
        "button-background-rotation": "backgroundRotation 4s infinite linear",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
