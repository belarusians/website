'use client';

import { DesktopMenu } from './desktop/desktopMenu';
import { useEffect, useState } from 'react';
import { MobileMenu } from './mobile/mobileMenu';
import { md } from '../utils';
import { Lang } from '../types';

export function Menu(props: { className?: string; lang: Lang }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = (): void => {
      setWidth(window.innerWidth);
    };
    const timeout = setTimeout(handleResize, 0);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={props.className}>
      {width < md ? <MobileMenu lang={props.lang} /> : <DesktopMenu lang={props.lang} />}
    </div>
  );
}
