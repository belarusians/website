'use client';

import Link from 'next/link';

import { useTranslation } from '../../../app/i18n/client';
import { LanguageSelector } from '../../language-selector';
import { Lang } from '../../types';
import { Dropdown } from '../../dropdown';

export function DesktopMenu({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang);

  return (
    <div className="flex items-center text-red gap-4 justify-between">
      <div
        className="text-lg flex rounded-md text-white bg-white cursor-pointer shadow-lg divide-solid divide-light-grey divide-x animate-wobble-right">
        <Dropdown className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-tb-xl text-red"
                  label={t('to-refugees')}
        >
          <div
            className="animate-t-fade-in absolute mt-2 z-10 divide-solid divide-light-grey divide-y flex flex-col bg-white shadow-lg rounded-md">
            <Link href="https://t.me/belarusians_nl_bot" className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-lrb-xl" target="_blank">
              {t('refugees-bot')}
            </Link>
          </div>
        </Dropdown>
        <Dropdown className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-tb-xl text-red"
                  label={t('about-us')}
        >
          <div
            className="animate-t-fade-in absolute mt-2 z-10 divide-solid divide-light-grey divide-y flex flex-col bg-white shadow-lg rounded-md">
            <Link className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-lr-xl" href={`/${lang}/about-us`}>
              {t('who-are-we')}
            </Link>
            <Link className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-lr-xl" href={`/${lang}/vacancies`}>
              {t('vacancies')}
            </Link>
            <Link className="p-1 md:p-2 lg:p-3 transition-shadow hover:shadow-lrb-xl" href={`/${lang}/join-us`}
                  data-umami-event="join-button"
            >
              {t('join-us')}
            </Link>
          </div>
        </Dropdown>
        <Link
          className="p-1 md:p-2 lg:p-3 bg-[length:350%_100%] bg-beautiful-button font-normal rounded-r-md text-white transition-all hover:shadow-tbr-xl animate-bg-rotation-slow-wobble-right"
          data-umami-event="donate-us"
          href={`/${lang}/donate`}
        >
          {t('donate-us')}
        </Link>
      </div>

      <LanguageSelector lang={lang} />
    </div>
  );
}
