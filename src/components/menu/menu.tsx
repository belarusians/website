import * as React from "react";

import { DesktopMenu } from "./desktop/desktopMenu";
import { useEffect, useState } from "react";

export function Menu(props: { className?: string }): JSX.Element {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", (e) => {
      setWidth(window.innerWidth);
    });
  });

  return <div className={props.className}>{width < 768 ? <DesktopMenu /> : <DesktopMenu />}</div>;
}
