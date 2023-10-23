"use client";

import { useEffect, useState, useRef } from "react";

import { useTranslation } from "../i18n/client";
import { Lang } from "../../components/types";

export function AchievementsBlock(props: { lang: Lang }) {
  const { t } = useTranslation(props.lang, "main");

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const counterRef = useRef<HTMLSpanElement>(null);
  const updateCounter = () => {
    if (!counterRef.current) {
      setTimeout(updateCounter, 5);
      return;
    }
    const target = 1600;
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
    <div className="flex items-center gap-1 md:gap-2 text-white flex-col">
      <p className="text-5xl md:text-7xl">
        <span ref={counterRef}></span>
        <span>€</span>
      </p>
      <p className="text-xl md:text-2xl text-center">{t("counter-text")}</p>
    </div>
  );
}
