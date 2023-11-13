import { ReactNode, useEffect, useRef } from "react";

// Written completely by copilot
export function ClickOutside({ children, onClickOutside }: { children: ReactNode, onClickOutside: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return <div ref={ref}>{children}</div>;
}
