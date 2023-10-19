import { PropsWithChildren } from "react";

import { PropsWithClass } from "../../app/types";

export function Section(props: PropsWithChildren & PropsWithClass) {
  return (
    <div className={`lg:container px-3 py-3 md:py-4 lg:py-6 md:animate-fade-in ${props.className || ""}`}>
      <div className="lg:container px-3">{props.children}</div>
    </div>
  );
}
