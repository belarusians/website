import { HTMLAttributes, PropsWithChildren, useEffect, useState } from "react";

export function ClientOnly({ children, ...delegated}: PropsWithChildren & HTMLAttributes<HTMLElement>): JSX.Element | null {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}
