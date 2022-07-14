import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { Trans } from "react-i18next";
import { useState } from "react";

import { active, button, li, list } from "./language-selector.css";

export function LanguageSelector(props: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const i18n = useI18next();
  const [lang, setLang] = useState(i18n.language);

  function onSelectLanguage(lang: string): void {
    i18n.changeLanguage(lang);
    setLang(lang);
  }

  return (
    <div className={props.className}>
      <ul className={list}>
        {i18n.languages.map((l) => (
          <li className={li} key={l}>
            <button className={`${button} ${lang === l ? active : ""}`} onClick={() => onSelectLanguage(l)}>
              <Trans>{l}</Trans>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
