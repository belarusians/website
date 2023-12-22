import * as React from 'react';

interface H3Props {
  children: React.ReactNode;
  className?: string;
}

export default function H3(props: H3Props): React.JSX.Element {
  return (
    <h3 className={`text-lg md:text-xl lg:text-2xl xl:text-3xl font-light mb-2 md:mb-3 ${props.className ?? ''}`}>
      {props.children}
    </h3>
  );
}
