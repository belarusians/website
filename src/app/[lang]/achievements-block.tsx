'use client';

import { useEffect, useState, useRef } from 'react';

import { getTranslation } from '../i18n/client';
import { Lang } from '../../components/types';

export function AchievementsBlock(props: { lang: Lang }) {
  const { t } = getTranslation(props.lang, 'main');

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const counterRef = useRef<HTMLSpanElement>(null);
  const updateCounter = (): void => {
    if (!counterRef.current) {
      setTimeout(updateCounter, 5);
      return;
    }
    const target = 4040;
    const count = +counterRef.current?.innerText;
    const increment = target / 202;
    if (count < target) {
      counterRef.current.innerText = `${Math.ceil(count + increment)}`;
      setTimeout(updateCounter, 5);
    } else {
      counterRef.current.innerText = `${target}`;
    }
  };

  if (hydrated) {
    updateCounter();
  }
  return (
    <div className="flex items-center gap-1 md:gap-2 text-white flex-col">
      <p className="text-4xl md:text-7xl">
        <span ref={counterRef}></span>
        <span>€</span>
      </p>
      <p className="text-lg md:text-2xl text-center">{t('counter-text')}</p>
    </div>
  );
}
