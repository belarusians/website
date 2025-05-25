'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useTranslation } from '../../../app/i18n/client';
import { LanguageSelector } from '../../language-selector';
import { Lang } from '../../types';
import { Button } from '../../button';
import { ClickOutside } from '../../click-outside';

export function MobileMenu({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang);
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  return (
    <ClickOutside onClickOutside={() => menuOpened && setMenuOpened(false)}>
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
          onClick={toggleMenu}
        >
          <span
            className={
              menuOpened
                ? 'transition-all duration-300 block bg-primary h-[8px] w-full rounded-xs origin-[6px_6px] rotate-45'
                : 'transition-all duration-300 block bg-primary h-[8px] w-full rounded-xs origin-[6px_6px]'
            }
          ></span>
          <span
            className={
              menuOpened
                ? 'transition-all duration-300 block bg-primary h-[8px] w-full rounded-xs origin-[5px_1px] -rotate-45'
                : 'transition-all duration-300 block bg-primary h-[8px] w-full rounded-xs origin-[5px_1px]'
            }
          ></span>
        </div>
        <div
          className={`fixed top-0 right-0 h-full w-52 bg-white-shade transition-transform transform duration-300 z-20 ${
            menuOpened ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <OpenedMenu lang={lang} onClick={toggleMenu} />
        </div>
        {menuOpened && (
          <div className="fixed top-0 left-0 w-full h-full bg-black z-10 opacity-50" onClick={toggleMenu}></div>
        )}
      </div>
    </ClickOutside>
  );
}

function OpenedMenu({ lang, onClick }: { lang: Lang; onClick: () => void }) {
  const { t } = useTranslation(lang);
  return (
    <div className="flex flex-col items-start w-full left-0 absolute pl-4">
      <LanguageSelector lang={lang} className="text-white py-4" />
      <Link className="text-primary text-lg py-2" href={`/${lang}/about-us`} onClick={onClick}>
        {t('about-us')}
      </Link>
      <Link className="text-primary text-lg py-2" href={`/${lang}/events`} onClick={onClick}>
        {t('events')}
      </Link>
      {/*<Link className="text-primary text-lg py-2" href={`/${lang}/guides`} onClick={onClick}>*/}
      {/*  {t('guides')}*/}
      {/*</Link>*/}
      <Link className="text-primary text-lg py-2" href={`/${lang}/vacancies`} onClick={onClick}>
        {t('vacancies')}
      </Link>
      <Link
        className="text-primary text-lg py-2"
        data-umami-event="donate-us"
        href={`/${lang}/donate`}
        onClick={onClick}
      >
        {t('donate-us')}
      </Link>
    </div>
  );
}
