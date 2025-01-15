'use client';

import { HTMLAttributes, PropsWithChildren, useEffect, useState, JSX } from 'react';

export function ClientOnly({ children }: PropsWithChildren & HTMLAttributes<HTMLElement>): JSX.Element | null {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
