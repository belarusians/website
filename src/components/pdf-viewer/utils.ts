import { md, lg } from "../utils";

export function getFullWidth(windowWidth: number, maxSize?: number): number {
  let possibleSize = 0;

  if (windowWidth <= md) {
    possibleSize = windowWidth - 45;
  } else if (windowWidth < lg) {
    possibleSize = windowWidth - 45;
  } else {
    possibleSize = windowWidth - 75;
  }
  if (maxSize !== undefined && possibleSize > maxSize) {
    return maxSize;
  } else {
    return possibleSize;
  }
}
