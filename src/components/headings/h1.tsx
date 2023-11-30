import * as React from 'react';

interface H1Props {
  children: React.ReactNode;
  className?: string;
}

export default function H1(props: H1Props): React.JSX.Element {
  return <h1 className={`text-xl font-medium md:text-3xl mb-2 ${props.className ?? ''}`}>{props.children}</h1>;
}
