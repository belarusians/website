const redColor = {
  first: '#ff1111',
  second: '#b40000',
  third: '#ff0000',
  fourth: '#af0000',
};

const beautifulButtonColors = [
  {
    first: '#e1bc28',
    second: '#21c241',
    third: '#115eb7',
    fourth: '#720cb6',
  },
  {
    first: '#e15328',
    second: '#bb20b3',
    third: '#e2b110',
    fourth: '#0ebcda',
  },
  {
    first: '#2885e1',
    second: '#24c758',
    third: '#0e9a21',
    fourth: '#0c2eb6',
  },
  {
    first: '#ac28e1',
    second: '#4128e1',
    third: '#1198b7',
    fourth: '#0cb697',
  },
];

const beautifulButtonColor = beautifulButtonColors[Math.floor(Math.random() * beautifulButtonColors.length)];

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {},
    extend: {
      colors: {
        red: {
          600: '#af0000',
          DEFAULT: '#ed1c24',
          500: '#ed1c24',
        },
        white: {
          DEFAULT: '#ffffff',
        },
        'white-shade': '#f6f6f6',
        black: '#231f20',
        'black-tint': '#333333',
        grey: 'rgb(128, 128, 128)',
        'light-grey': 'rgb(235,235,235)',
      },
      boxShadow: {
        'lr-xl': '15px 0px 15px -20px rgba(0, 0, 0, 0.4), -15px 0px 15px -20px rgba(0, 0, 0, 0.4)',
        'lrb-xl': '15px 10px 20px -10px rgba(0, 0, 0, 0.1), -15px 10px 20px -10px rgba(0, 0, 0, 0.1)',
        'tb-xl': '0px 25px 20px -14px rgba(0, 0, 0, 0.1), 0px 6px 6px -6px rgba(0, 0, 0, 0.10)',
        'tbr-xl': '1px 25px 20px -14px rgba(0, 0, 0, 0.1), 1px 6px 6px -6px rgba(0, 0, 0, 0.10)',
        'tbl-xl': '-1px 25px 20px -14px rgba(0, 0, 0, 0.1), -1px 6px 6px -6px rgba(0, 0, 0, 0.10)',
      },
      backgroundImage: {
        'white-gradient': 'linear-gradient(to top, rgba(255,255,255,255), rgba(255,255,255,0))',
        nl: 'linear-gradient(180deg, #AE1C28 0, #AE1C28 33%, #FFF 33%, #FFF 67%, #21468B 67%, #21468B 100%)',
        be: 'linear-gradient(180deg, #FFF 0, #FFF 33%, #ed1c24 33%, #ed1c24 67%, #FFF 67%, #FFF 100%)',
        'beautiful-gradient':
          'radial-gradient(26.76% 85.52% at 86.73% -12.86%, #af0000 6.65%, transparent), radial-gradient(farthest-side at bottom left, #af0000 6.65%, #ed1c24 100%)',
        'beautiful-button': `linear-gradient(60deg, ${beautifulButtonColor.first}, ${beautifulButtonColor.second}, ${beautifulButtonColor.third}, ${beautifulButtonColor.fourth}, ${beautifulButtonColor.first}, ${beautifulButtonColor.second}, ${beautifulButtonColor.third})`,
        'red-gradient': `linear-gradient(60deg, ${redColor.first}, ${redColor.second}, ${redColor.third}, ${redColor.fourth}, ${redColor.first}, ${redColor.second}, ${redColor.third})`,
      },
      scale: {
        101: '1.01',
      },
      keyframes: {
        rotation: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        rotationBack: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(-360deg)',
          },
        },
        shake: {
          '0%': {
            transform: 'translateX(0)',
          },
          '25%': {
            transform: 'translateX(5px)',
          },
          '50%': {
            transform: 'translateX(-5px)',
          },
          '75%': {
            transform: 'translateX(5px)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: 0,
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        't-fade-in': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        't-fade-out': {
          '0%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(-30px)',
          },
        },
        wobble: {
          '0%': {
            borderRadius: '10px 30px 15px 30px',
          },
          '20%': {
            borderRadius: '30px 10px 30px 15px',
          },
          '40%': {
            borderRadius: '30% 30% 20% 20%',
          },
          '60%': {
            borderRadius: '30px 15px 30px 15px',
          },
          '80%': {
            borderRadius: '30px 20% 30% 30%',
          },
          '100%': {
            borderRadius: '10px 30px 15px 30px',
          },
        },
        'wobble-right': {
          '0%': {
            borderTopRightRadius: '30px',
            borderBottomRightRadius: '15px',
          },
          '20%': {
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '30px',
          },
          '40%': {
            borderTopRightRadius: '15px',
            borderBottomRightRadius: '10px',
          },
          '60%': {
            borderTopRightRadius: '15px',
            borderBottomRightRadius: '30px',
          },
          '80%': {
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '15px',
          },
          '100%': {
            borderTopRightRadius: '30px',
            borderBottomRightRadius: '15px',
          },
        },
        backgroundRotation: {
          '0%': {
            backgroundPosition: '0 0',
          },
          '100%': {
            backgroundPosition: '100% 0',
          },
        },
      },
      animation: {
        rotate: 'rotation 0.7s linear infinite',
        'rotate-slow': 'rotation 1.3s linear infinite',
        'rotate-back': 'rotationBack 0.7s linear infinite',
        'rotate-back-fast': 'rotationBack 0.5s linear infinite',
        shake: 'shake .6s ease-in-out 1',
        'fade-in': 'fade-in .4s ease-in-out forwards',
        't-fade-in': 't-fade-in .2s ease-in-out forwards',
        'bg-rotation-slow': 'backgroundRotation 5s infinite linear',
        'bg-rotation-slow-wobble-right':
          'backgroundRotation 5s infinite linear, wobble-right 6s ease-in-out alternate infinite',
        'bg-rotation-slow-wobble': 'backgroundRotation 5s infinite linear, wobble 6s ease-in-out alternate infinite',
        'bg-rotation-fast': 'backgroundRotation 4s infinite linear',
        'wobble-right': 'wobble-right 6s ease-in-out alternate infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
