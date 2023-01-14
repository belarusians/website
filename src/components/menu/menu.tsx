import * as React from "react";

import { DesktopMenu } from "./desktop/desktopMenu";
import { useEffect, useState } from "react";
import { MobileMenu } from "./mobile/mobileMenu";
import { maxMobileWidth } from "../sprinkles.css";

export function Menu(props: { className?: string }): JSX.Element {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  return <div className={props.className}>{width < maxMobileWidth ? <MobileMenu /> : <DesktopMenu />}</div>;
}
