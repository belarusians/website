import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { Trans } from "react-i18next";

export function LanguageSelector(
  props: React.HTMLAttributes<HTMLElement>
): JSX.Element {
  const { languages, changeLanguage } = useI18next();
  return (
    <div className={props.className}>
      <ul>
        {languages.map((language) => (
          <li key={language}>
            <button onClick={() => changeLanguage(language)}>
              <Trans>{language}</Trans>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
