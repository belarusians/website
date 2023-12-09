import * as React from 'react';

interface H1Props {
  children: React.ReactNode;
  className?: string;
}

export default function H1(props: H1Props): React.JSX.Element {
  return (
    <h1
      className={`text-xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight tracking-tight font-medium mb-4 ${
        props.className ?? ''
      }`}
    >
      {props.children}
    </h1>
  );
}
