const beautifulButtonColor = {
  first: "#ac28e1",
  second: "#4128e1",
  third: "#1198b7",
  fourth: "#0cb697",
};

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      red: "#ed1c24",
      white: "#ffffff",
      black: "#231f20",
      "light-black": "#333333",
      grey: "rgb(128, 128, 128)",
      "light-grey": "rgb(217,217,217)",
    },
    container: {
      center: true,
    },
    fontFamily: {},
    extend: {
      backgroundImage: {
        "beautiful-button": `linear-gradient(60deg, ${beautifulButtonColor.first}, ${beautifulButtonColor.second}, ${beautifulButtonColor.third}, ${beautifulButtonColor.fourth}, ${beautifulButtonColor.first}, ${beautifulButtonColor.second}, ${beautifulButtonColor.third})`,
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
        "beautiful-button": "wobble 6s ease-in-out alternate infinite, backgroundRotation 5s infinite linear",
      },
    },
  },
  plugins: [],
};
