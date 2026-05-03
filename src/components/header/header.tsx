import Link from 'next/link';

import { Logo } from './logo';
import { Menu } from '../menu/menu';
import { Lang } from '../types';
import { getTranslation } from '../../app/i18n';

export async function Header(props: { className: string; lang: Lang }) {
  const { t } = await getTranslation(props.lang, 'common');
  return (
    <header
      className={`sticky md:static flex items-center bg-white-shade/85 backdrop-blur-[16px] backdrop-saturate-[1.8] md:bg-white-shade px-3 py-2 md:py-4 lg:py-8 top-0 z-50 gap-4 lg:gap-8 ${props.className}`}
    >
      <Link href={`/${props.lang}`} aria-label={t('home-link-label')} passHref>
        <div className="flex">
          <Logo className="w-36 md:w-56 lg:w-72 xl:w-80" />
        </div>
      </Link>
      <Menu lang={props.lang} className="grow" />
    </header>
  );
}
