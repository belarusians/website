import { style } from "@vanilla-extract/css";
import { sprinkles } from "./sprinkles.css";

export const vertical = style([
  {
    display: "flex",
    flexDirection: "column",
  },
]);

export const col = style([
  vertical,
  {
    gap: "1rem",
  },
]);

export const col_lg__row_md = style([
  sprinkles({
    flexDirection: {
      sm: "row",
      md: "row",
      lg: "column",
    },
  }),
  {
    display: "flex",
    gap: "1rem",
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

export const row = style([
  {
    flexDirection: "row",
    display: "flex",
    gap: "1rem",
  },
]);

export const w_lg_2 = style([
  {
    display: "flex",
  },
  sprinkles({
    flexGrow: {
      sm: 1,
      md: 1,
      lg: 2,
    },
    flexBasis: {
      sm: "7rem",
      md: "9rem",
      lg: "18rem",
    },
  }),
]);

export const w_1 = style([
    {
    display: "flex",
  },
  sprinkles({
    flexGrow: {
      sm: 1,
      md: 1,
      lg: 1,
    },
    flexBasis: {
      sm: "7rem",
      md: "9rem",
      lg: "9rem",
    },
  }),
]);

export const w_eq = style([{
  flex: "1 1 0px",
}]);
