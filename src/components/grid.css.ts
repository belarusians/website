import { style } from "@vanilla-extract/css";
import { sprinkles } from "./sprinkles.css";

export const col = style([
  {
    display: "flex",
    gap: "1rem",
    flexDirection: "column",
  },
]);

export const row_lg = style([
  sprinkles({
    flexDirection: {
      sm: "column",
      md: "column",
      lg: "row",
    },
  }),
  {
    display: "flex",
    gap: "1rem",
  },
]);

export const w_lg_2 = style([
  sprinkles({
    flexGrow: {
      sm: 1,
      md: 1,
      lg: 2,
    },
    flexBasis: {
      sm: "10rem",
      md: "10rem",
      lg: "20rem",
    },
  }),
]);

export const w_1 = style([
  sprinkles({
    flexGrow: {
      sm: 1,
      md: 1,
      lg: 1,
    },
    flexBasis: {
      sm: "10rem",
      md: "10rem",
      lg: "10rem",
    },
  }),
]);

// TODO: initial refactoring
// function rem(n: number): string {
//   return `${n}rem`;
// }
//
// const basis = {
//   flexGrow: {
//     sm: 1,
//     md: 1,
//     lg: 1,
//   },
//   flexBasis: {
//     sm: 10,
//     md: 10,
//     lg: 10,
//   },
// };
//
// function lg(multiplier: number) {
//   return {
//     flexGrow: {
//       sm: basis.flexGrow.sm,
//       md: basis.flexGrow.md,
//       lg: basis.flexGrow.lg * multiplier,
//     },
//     flexBasis: {
//       sm: rem(basis.flexBasis.sm),
//       md: rem(basis.flexBasis.md),
//       lg: rem(basis.flexBasis.lg * multiplier),
//     },
//   };
// }