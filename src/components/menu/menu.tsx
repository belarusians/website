import * as React from "react";

import { DesktopMenu } from "./desktop/desktopMenu";
import { useEffect, useState } from "react";
import { MobileMenu } from "./mobile/mobileMenu";
import { md } from "../utils";
import { ClientOnly } from "../client-only/client-only";

export function Menu(props: { className?: string }): JSX.Element {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  return (
    <ClientOnly>
      <div className={props.className}>{width < md ? <MobileMenu /> : <DesktopMenu />}</div>
    </ClientOnly>
  );
}
