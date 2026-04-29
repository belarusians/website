'use client';

import { JSX, useEffect, useState } from 'react';

import { getTranslation } from '../../app/i18n/client';
import { Lang } from '../types';
import { applyConsent, ConsentChoice, readConsent, writeConsent } from '../../lib/consent';

export type ConsentBannerProps = { lang: Lang; privacyHref?: string };

type Translator = (key: string) => string;

type BannerState = 'visible' | 'hidden';

export type RenderMode = 'banner' | 'pill' | 'none';

// Re-apply a previously stored choice so gtag isn't stuck at default-denied
// for returning users who accepted (or revoked back to denied) on a prior
// visit. Exported for direct testing (the project's Jest config runs in Node
// with no renderer, so useEffect bodies can't be exercised through rendering).
export function applyStoredConsent(): ConsentChoice | null {
  const stored = readConsent();
  if (stored === 'granted') {
    applyConsent('granted');
  }
  return stored;
}

export function recordAccept(): void {
  writeConsent('granted');
  applyConsent('granted');
}

export function recordDecline(): void {
  writeConsent('denied');
  // Downgrade gtag in case consent was previously granted in this session
  // (e.g. user accepted, opened the reopen pill, then declined). For a
  // first-time decline gtag is already at default-denied so this is a no-op.
  applyConsent('denied');
}

export function decideRenderMode(state: BannerState, hasStoredChoice: boolean): RenderMode {
  if (state === 'visible') return 'banner';
  if (hasStoredChoice) return 'pill';
  return 'none';
}

const BANNER_CLASSES = [
  'fixed',
  'left-3',
  'right-3',
  'bottom-4',
  'p-[18px]',
  'pb-[calc(16px+env(safe-area-inset-bottom))]',
  'bg-white',
  'rounded-md',
  'shadow-2xl',
  'z-50',
  'animate-cc-in',
  'md:left-[18px]',
  'md:right-auto',
  'md:bottom-[18px]',
  'md:w-[360px]',
  'md:p-5',
  'md:z-40',
].join(' ');

const ROW_CLASSES = [
  'flex',
  'flex-col',
  'items-stretch',
  'gap-3',
  'md:flex-row',
  'md:items-center',
  'md:justify-between',
  'md:gap-4',
  'md:flex-wrap',
].join(' ');

const ACTIONS_CLASSES = ['grid', 'grid-cols-2', 'gap-2.5', 'w-full', 'md:flex', 'md:w-auto', 'md:items-center'].join(
  ' ',
);

const BUTTON_BASE_CLASSES = [
  'rounded-md',
  'shadow-lg',
  'hover:shadow-xl',
  'active:shadow-2xl',
  'px-4',
  'py-2.5',
  'text-sm',
  'font-normal',
  'transition-shadow',
].join(' ');

const DECLINE_BUTTON_CLASSES = `${BUTTON_BASE_CLASSES} bg-white text-black-tint`;
const ACCEPT_BUTTON_CLASSES = `${BUTTON_BASE_CLASSES} bg-primary text-white`;

const PRIVACY_LINK_CLASSES = 'text-[13px] text-grey self-start hover:text-primary';

const PILL_CLASSES = [
  'fixed',
  'bottom-4',
  'left-3',
  'md:bottom-[18px]',
  'md:left-[18px]',
  'inline-flex',
  'items-center',
  'gap-2',
  'bg-white',
  'rounded-full',
  'shadow-lg',
  'hover:shadow-xl',
  'px-3',
  'py-2',
  'text-grey',
  'text-xs',
  'font-medium',
  'transition-shadow',
  'z-40',
].join(' ');

export function renderBannerCard(
  t: Translator,
  handlers: { onAccept: () => void; onDecline: () => void; privacyHref?: string },
): JSX.Element {
  const privacyHref = handlers.privacyHref?.trim();
  return (
    <section role="region" aria-label={t('aria.region')} className={BANNER_CLASSES}>
      <h3 className="m-0 mb-1.5 text-base font-medium tracking-tight">{t('title')}</h3>
      <p className="m-0 mb-3.5 text-sm font-light leading-[1.55] text-black-tint">{t('body')}</p>
      <div className={ROW_CLASSES}>
        {privacyHref ? (
          <a href={privacyHref} className={PRIVACY_LINK_CLASSES}>
            {t('privacy')}
          </a>
        ) : null}
        <div className={ACTIONS_CLASSES}>
          <button type="button" className={DECLINE_BUTTON_CLASSES} onClick={handlers.onDecline}>
            {t('decline')}
          </button>
          <button type="button" className={ACCEPT_BUTTON_CLASSES} onClick={handlers.onAccept}>
            {t('accept')}
          </button>
        </div>
      </div>
    </section>
  );
}

export function renderReopenPill(t: Translator, onReopen: () => void): JSX.Element {
  return (
    <button type="button" aria-label={t('reopen')} className={PILL_CLASSES} onClick={onReopen}>
      <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
      {t('reopen')}
    </button>
  );
}

export function ConsentBanner({ lang, privacyHref }: ConsentBannerProps): JSX.Element | null {
  const { t } = getTranslation(lang, 'consent');
  const [state, setState] = useState<BannerState>('hidden');
  const [hasStoredChoice, setHasStoredChoice] = useState<boolean>(false);

  useEffect(() => {
    const stored = applyStoredConsent();
    // localStorage cannot be read during SSR, so the post-mount setState is
    // the only place this hydration can happen without a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (stored === null) {
      setState('visible');
    } else {
      setHasStoredChoice(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const mode = decideRenderMode(state, hasStoredChoice);

  if (mode === 'banner') {
    return renderBannerCard(t, {
      privacyHref,
      onAccept: () => {
        recordAccept();
        setHasStoredChoice(true);
        setState('hidden');
      },
      onDecline: () => {
        recordDecline();
        setHasStoredChoice(true);
        setState('hidden');
      },
    });
  }

  if (mode === 'pill') {
    return renderReopenPill(t, () => setState('visible'));
  }

  return null;
}
