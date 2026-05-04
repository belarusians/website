import { DesktopMenu } from './desktop/desktopMenu';
import { LanguageSelector } from '../language-selector';
import { Lang } from '../types';

export function Menu(props: { className?: string; lang: Lang }) {
  return (
    <div className={`flex items-center ${props.className ?? ''}`}>
      <div className="hidden md:contents">
        <DesktopMenu lang={props.lang} />
      </div>
      <LanguageSelector lang={props.lang} className="md:hidden ml-auto" />
    </div>
  );
}