'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useTranslation } from '../../../app/i18n/client';
import { LanguageSelector } from '../../language-selector';
import { Lang } from '../../types';
import { Button } from '../../button';

export function MobileMenu({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang);
  const [menuOpened, toggleMenuState] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Button
        className="mr-4 p-1 md:p-2 lg:p-3 bg-[length:350%_100%] bg-beautiful-button font-normal rounded-r-md text-white transition-all hover:shadow-tbr-xl animate-bg-rotation-slow-wobble"
        trackingName="join-button"
        link={`/${lang}/join-us`}
      >
        {t('join-us')}
      </Button>

      <div
        className="flex flex-col justify-between top-[17px] left-[20px] h-[24px] w-[32px] cursor-pointer z-40"
        onClick={() => toggleMenuState(!menuOpened)}
      >
        <span
          className={
            menuOpened
              ? 'transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[6px_6px] rotate-45'
              : 'transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[6px_6px]'
          }
        ></span>
        <span
          className={
            menuOpened
              ? 'transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[5px_1px] -rotate-45'
              : 'transition-all duration-300 block bg-white h-[8px] w-full rounded-sm origin-[5px_1px]'
          }
        ></span>
      </div>
      {menuOpened ? <OpenedMenu lang={lang} /> : null}
    </div>
  );
}

function OpenedMenu({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang);
  return (
    <div className="bg-red flex flex-col items-end w-full top-[53px] left-0 absolute z-40 divide-solid divide-white divide-y pr-4">
      <LanguageSelector lang={lang} className="text-white py-4" />
      <Link className="text-white text-xl py-4" href={`/${lang}/about-us`}>
        {t('about-us')}
      </Link>
      <Link className="text-white text-xl py-4" href={`/${lang}/events`}>
        {t('events')}
      </Link>
      {/*<Link className="text-white text-xl py-4" href={`/${lang}/news`}>*/}
      {/*  {t('news')}*/}
      {/*</Link>*/}
      <Link className="text-white text-xl py-4" href={`/${lang}/vacancies`}>
        {t('vacancies')}
      </Link>
      <Link className="text-white py-4 text-xl" data-umami-event="donate-us" href={`/${lang}/donate`}>
        {t('donate-us')}
      </Link>
    </div>
  );
}
