import * as React from 'react';

interface H2Props {
  children: React.ReactNode;
  className?: string;
}

export default function H2(props: H2Props): React.JSX.Element {
  return (
    <h2 className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium mb-4 ${props.className ?? ''}`}>
      {props.children}
    </h2>
  );
}
