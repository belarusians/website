import * as React from "react";

interface H3Props {
  children: React.ReactNode;
  className?: string;
}

export default function H3(props: H3Props): React.JSX.Element {
  return <h3 className={`text-xl font-light md:text-3xl mb-2 ${props.className ?? ""}`}>{props.children}</h3>;
}
