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
      lg: "row",
    },
  }),
  {
    flexWrap: "wrap",
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
    flexGrow: 1,
    // TODO: I do not like these flex-basis. Makes sense to investigate css grid in this use-case
    flexBasis: {
      sm: "7rem",
      md: "9rem",
    },
  }),
]);

export const w_eq = style([
  {
    flex: "1 1 0px",
  },
]);
