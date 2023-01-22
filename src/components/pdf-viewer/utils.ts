import { maxMobileWidth, minDesktopWidth } from "../sprinkles.css";

export function getFullWidth(windowWidth: number, maxSize?: number): number {
  let possibleSize = 0;
  console.log(windowWidth);
  if (windowWidth <= maxMobileWidth) {
    possibleSize = windowWidth - 45;
  } else if (windowWidth < minDesktopWidth) {
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
