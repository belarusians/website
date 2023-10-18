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
    first: "#e15328",
    second: "#bb20b3",
    third: "#e2b110",
    fourth: "#0ebcda",
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
    container: {
      center: true,
    },
    fontFamily: {},
    extend: {
      colors: {
        red: "#ed1c24",
        "red-shade": "#af0000",
        white: "#ffffff",
        "white-shade": "#f8f8f8",
        black: "#231f20",
        "black-tint": "#333333",
        grey: "rgb(128, 128, 128)",
        "light-grey": "rgb(235,235,235)",
      },
      boxShadow: {
        "tb-xl": "0px 25px 20px -14px rgba(0, 0, 0, 0.10), 0px 6px 6px -6px rgba(0, 0, 0, 0.10)",
        "tbr-xl": "1px 25px 20px -14px rgba(0, 0, 0, 0.10), 1px 6px 6px -6px rgba(0, 0, 0, 0.10)",
        "tbl-xl": "-1px 25px 20px -14px rgba(0, 0, 0, 0.10), -1px 6px 6px -6px rgba(0, 0, 0, 0.10)",
      },
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
        rotation: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          }
        },
        rotationBack: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(-360deg)",
          }
        },
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
        "wobble-right": {
          "0%": {
            borderTopRightRadius: "30px",
            borderBottomRightRadius: "15px",
          },
          "20%": {
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "30px",
          },
          "40%": {
            borderTopRightRadius: "15px",
            borderBottomRightRadius: "10px",
          },
          "60%": {
            borderTopRightRadius: "15px",
            borderBottomRightRadius: "30px",
          },
          "80%": {
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "15px",
          },
          "100%": {
            borderTopRightRadius: "30px",
            borderBottomRightRadius: "15px",
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
        rotate: "rotation 0.7s linear infinite",
        "rotate-slow": "rotation 1.3s linear infinite",
        "rotate-back": "rotationBack 0.7s linear infinite",
        "rotate-back-fast": "rotationBack 0.5s linear infinite",
        shake: "shake .6s ease-in-out 1",
        "fade-in": "fade-in .5s ease-in-out forwards",
        "bg-rotation-slow": "backgroundRotation 5s infinite linear",
        "bg-rotation-slow-wobble-right":
          "backgroundRotation 5s infinite linear, wobble-right 6s ease-in-out alternate infinite",
        "bg-rotation-slow-wobble": "backgroundRotation 5s infinite linear, wobble 6s ease-in-out alternate infinite",
        "bg-rotation-fast": "backgroundRotation 4s infinite linear",
        "wobble-right": "wobble-right 6s ease-in-out alternate infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
