import * as React from "react";

interface H2Props {
  children: React.ReactNode;
  className?: string;
}

export default function H2(props: H2Props): React.JSX.Element {
  return <h2 className={`text-xl font-medium md:text-3xl mb-2 ${props.className ?? ""}`}>{props.children}</h2>;
}
