import React, { useEffect, useState } from "react";

import { row } from "../grid.css";
import { counter, achievementContainer, counterText } from "./achievements.css";
import { useTranslation } from "next-i18next";

export function AchievementsBlock(): JSX.Element {
  const counterRef = React.useRef<HTMLSpanElement>(null);

  const { t } = useTranslation("main");

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const updateCounter = () => {
    if (!counterRef.current) {
      setTimeout(updateCounter, 5);
      return;
    }
    const target = 600;
    const count = +counterRef.current?.innerText;
    const increment = target / 100;
    if (count < target) {
      counterRef.current.innerText = `${Math.ceil(count + increment)}`;
      setTimeout(updateCounter, 10);
    } else {
      counterRef.current.innerText = `${target}`;
    }
  };

  if (hydrated) {
    updateCounter();
  }
  return (
    <div className={row}>
      <div className={achievementContainer}>
        <span className={counter}>
          <span ref={counterRef}></span>
          <span>€</span>
        </span>
        <span className={counterText}>{t("counter-text")}</span>
      </div>
    </div>
  );
}
