import * as React from "react";
import { useRouter } from "next/router";
import { useState } from "react";

import { active, button, list } from "./language-selector.css";

function formFlag(locales: string[]): string[] {
  const middle = Math.round(locales.length / 2) - 1;
  const beIndex = locales.indexOf("be");
  if (middle === beIndex) {
    return locales;
  }
  const copy = locales.slice();
  const tmp = locales[middle];
  copy[middle] = copy[beIndex];
  copy[beIndex] = tmp;

  return copy;
}

export function LanguageSelector(props: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const router = useRouter();
  const { locale, locales, route, asPath } = router;
  const [loc, setLoc] = useState(locale);

  const sortedLocales = formFlag(locales || []);

  function onSelectLanguage(l: string): void {
    router.push(route, asPath, { locale: l });
    setLoc(l);
  }

  return (
    <div className={props.className}>
      <div className={list}>
        {sortedLocales.map((l) => (
          <button className={`${button} ${loc === l ? active : ""}`} key={l} onClick={() => onSelectLanguage(l)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
