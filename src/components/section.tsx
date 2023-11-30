import * as React from 'react';

export function Section(props: React.PropsWithChildren & { className?: string }): JSX.Element {
  return (
    <div className={`py-3 md:py-4 lg:py-6 md:animate-fade-in ${props.className || ''}`}>
      <div className="lg:container px-3">{props.children}</div>
    </div>
  );
}
