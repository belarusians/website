import React, { useEffect, useState } from "react";
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
    <div className="flex justify-center gap-3 md:gap-4 text-white flex-col text-center">
      <span className="text-5xl md:text-7xl">
        <span ref={counterRef}></span>
        <span>€</span>
      </span>
      <span className="text-xl md:text-2xl">{t("counter-text")}</span>
    </div>
  );
}
